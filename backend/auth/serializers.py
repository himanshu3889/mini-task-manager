from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError as DjangoValidationError

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'username': {'required': False},
        }

    def validate_password(self, value):
        """Custom password validation with clean error messages"""
        try:
            # Can use the passoword validation here
            if len(value) < 8:
                raise serializers.ValidationError("Password must be at least 8 characters long")
            if len(value) > 128:
                raise serializers.ValidationError("Password must be less than 128 characters long")
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)  # Returns list of errors
        return value

    def validate(self, attrs):
        # Use email as username if username not provided
        if not attrs.get('username'):
            attrs['username'] = attrs['email']
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        username = validated_data.pop('username', validated_data.get('email'))
        
        user = User.objects.create_user(
            username=username,
            email=validated_data.get('email', ''),
            password=password
        )
        return user