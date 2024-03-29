from rest_framework import status, permissions
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.views import TokenViewBase
from django.conf import settings

from .serializers import AppUserSerializer, AppTokenObtainPairSerializer

class InvalidUser(AuthenticationFailed):
  status_code = status.HTTP_406_NOT_ACCEPTABLE
  default_detail = ('User credentials are invalid or expired.')
  default_code = 'user_credentials_not_valid'

class AppUserCreate(APIView):
  authentication_classes = []
  permission_classes = (permissions.AllowAny,)

  def post(self, request, format='json'):
    serializer = AppUserSerializer(data=request.data)

    if serializer.is_valid():
      user = serializer.save()

      if user:
        json = serializer.data

        return Response(json, status=status.HTTP_201_CREATED)
    
    return Response(
      serializer.errors,
      headers=settings.ACCESS_CONTROL_RESPONSE_HEADERS,
      status=status.HTTP_400_BAD_REQUEST
    )

class ObtainRefreshToken(TokenViewBase):
  authentication_classes = []
  permission_classes = (permissions.AllowAny,)
  serializer_class = AppTokenObtainPairSerializer

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)

    try:
      serializer.is_valid(raise_exception=True)
    except AuthenticationFailed as e:
      raise InvalidUser(e.args[0])
    except TokenError as e:
      raise InvalidToken(e.args[0])
    
    return Response(
      serializer.validated_data,
      headers=settings.ACCESS_CONTROL_RESPONSE_HEADERS,
      status=status.HTTP_200_OK
    )