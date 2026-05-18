from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserTests(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password123',
            rol='CLIENTE'
        )
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.rol, 'CLIENTE')
        self.assertTrue(user.is_active)

    def test_create_productor(self):
        user = User.objects.create_user(
            username='productor',
            email='productor@example.com',
            password='password123',
            rol='PRODUCTOR'
        )
        self.assertEqual(user.rol, 'PRODUCTOR')

