from rest_framework import serializers
from .models import User

# Profile dekhne ke liye
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_seeker', 'is_employer', 'phone', 'bio']

# Register karne ke liye
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone']

    def create(self, validated_data):
        # Password ko secure (hash) karke save karna
        user = User.objects.create_user(**validated_data)
        return user