from rest_framework import viewsets
from rest_framework.decorators import action, permission_classes, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token
from .models import Service, Product, Review, Order
from .serializers import ServiceSerializer, ProductSerializer, ReviewSerializer, OrderSerializer
import requests
import base64
from django.conf import settings
from datetime import datetime

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [AllowAny()]  # Still relaxed from prior fix

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated POST

    @action(detail=False, methods=['post'])
    def initiate_payment(self, request):
        consumer_key = "lUj851vNvJpb3Pc3B9GOtIAy78GP5bAppoW99TNJICFsX2Ie"
        consumer_secret = "7vCiSbuH0a87NZGmZxMJuR5nMYu4OY76T7SaBciPPAPn4nTsG7KxDD0MYYNElLMG"
        shortcode = "174379"
        passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
        phone = request.data.get('phone')
        amount = request.data.get('total')
        order_id = request.data.get('order_id')

        api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        headers = {"Authorization": "Basic " + base64.b64encode(f"{consumer_key}:{consumer_secret}".encode()).decode()}
        response = requests.get(api_url, headers=headers)
        access_token = response.json().get("access_token")

        stk_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = base64.b64encode(f"{shortcode}{passkey}{timestamp}".encode()).decode()
        payload = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone,
            "PartyB": shortcode,
            "PhoneNumber": phone,
            "CallBackURL": "http://localhost:8000/callback",
            "AccountReference": f"Order-{order_id}",
            "TransactionDesc": "Payment for aquarium order"
        }
        headers = {"Authorization": f"Bearer {access_token}"}
        stk_response = requests.post(stk_url, json=payload, headers=headers)

        if stk_response.status_code == 200:
            # Store CheckoutRequestID in the order
            order = Order.objects.get(id=order_id)
            order.checkout_request_id = stk_response.json().get("CheckoutRequestID")
            order.save()
            return Response({"message": "Payment initiated", "data": stk_response.json()})
        return Response({"error": "STK Push failed", "details": stk_response.text}, status=400)
        
        
@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        csrf_token = get_token(request)
        return Response({"message": "Login successful", "csrfToken": csrf_token})
    return Response({"error": "Invalid credentials"}, status=401)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    token = get_token(request)
    return Response({'csrfToken': token})
