from django.conf import settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extend the default serializer to accept either 'username' or the configured
    USERNAME_FIELD (email) so clients sending 'username' won't break when
    USERNAME_FIELD='email'.
    """

    def validate(self, attrs):
        # If the project uses email as the USERNAME_FIELD but client sent 'username'
        # map it to the expected field name so parent validation works.
        username_field = settings.AUTH_USER_MODEL.split('.')[-1].lower()
        # settings.AUTH_USER_MODEL is like 'users.User' — but we want settings.USERNAME_FIELD
        username_field = getattr(settings, 'USERNAME_FIELD', 'username')

        # If client supplied 'username' but our USERNAME_FIELD is different, map it
        if 'username' in attrs and username_field != 'username':
            # don't override if the correct field is already present
            if username_field not in attrs:
                attrs[username_field] = attrs.pop('username')

        return super().validate(attrs)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
