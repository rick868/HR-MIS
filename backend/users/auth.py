from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extend the default serializer to accept either 'username' or the configured
    USERNAME_FIELD (email) so clients sending 'username' won't break when
    USERNAME_FIELD='email'.
    """

    def validate(self, attrs):
        # Ensure we accept whatever the actual user model declares as USERNAME_FIELD
        user_model = get_user_model()
        username_field = getattr(user_model, 'USERNAME_FIELD', 'username')

        # Map common client fields to the expected USERNAME_FIELD
        # Accept 'email' when USERNAME_FIELD is 'email', and accept 'username' when different
        if username_field not in attrs:
            if username_field == 'email' and 'email' in attrs:
                attrs[username_field] = attrs.get('email')
            elif 'username' in attrs:
                attrs[username_field] = attrs.get('username')

        return super().validate(attrs)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
