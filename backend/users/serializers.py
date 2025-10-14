from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """
    password = serializers.CharField(write_only=True, required=False)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'department', 'bio', 'location',
            'email_alerts', 'push_notifications', 'weekly_reports',
            'performance_alerts', 'attendance_alerts',
            'two_factor_auth', 'session_timeout', 'password_expiry',
            'language', 'timezone', 'date_format', 'currency',
            'number_format', 'week_starts_on', 'theme',
            'data_retention', 'auto_backup', 'export_format',
            'is_active', 'is_staff', 'created_at', 'updated_at',
            'password'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_full_name(self, obj):
        return obj.get_full_name()

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile updates (limited fields)
    """
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone', 'department',
            'bio', 'location'
        ]


class UserSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for user settings updates
    """
    class Meta:
        model = User
        fields = [
            'email_alerts', 'push_notifications', 'weekly_reports',
            'performance_alerts', 'attendance_alerts',
            'two_factor_auth', 'session_timeout', 'password_expiry',
            'language', 'timezone', 'date_format', 'currency',
            'number_format', 'week_starts_on', 'theme',
            'data_retention', 'auto_backup', 'export_format'
        ]


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include email and password.')

        return data


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user
