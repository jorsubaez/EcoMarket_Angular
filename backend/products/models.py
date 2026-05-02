import io
import uuid

from django.conf import settings
from django.core.files.base import ContentFile
from django.db import models
from PIL import Image


MAX_IMAGE_WIDTH = 1200
WEBP_QUALITY = 80


def rename_product_image(instance, filename):
    """Generate a unique filename using UUID, always stored as .webp."""
    unique_name = f"producto_{uuid.uuid4().hex}.webp"
    return f"productos/{unique_name}"


class Producto(models.Model):
    ESTADO_VERIFICACION_CHOICES = (
        ('PENDIENTE', 'Pendiente'),
        ('VERIFICADO', 'Verificado'),
        ('RECHAZADO', 'Rechazado'),
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='productos'
    )
    name = models.CharField(max_length=200)
    origin = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20)
    description = models.TextField(blank=True, null=True)
    quantity = models.IntegerField(default=0)
    image = models.ImageField(upload_to=rename_product_image, blank=True, null=True)
    certificate = models.FileField(upload_to='certificates/', blank=True, null=True)

    verification_status = models.CharField(
        max_length=20,
        choices=ESTADO_VERIFICACION_CHOICES,
        default='PENDIENTE'
    )

    # Legacy field kept for backward compatibility with seed data
    image_url_legacy = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.origin}"

    def save(self, *args, **kwargs):
        """
        After saving, process the image file with Pillow:
        - Resize to max MAX_IMAGE_WIDTH px wide (proportional).
        - Convert to WebP format.
        - Save at WEBP_QUALITY % quality.
        The DB stores only the relative file path, never binary data.
        """
        # Persist the record first so the file is already on disk.
        super().save(*args, **kwargs)

        if not self.image:
            return

        try:
            img = Image.open(self.image.path)

            # Convert palette or RGBA to RGB for WebP compatibility.
            if img.mode in ("P", "RGBA"):
                img = img.convert("RGBA")
            elif img.mode != "RGB":
                img = img.convert("RGB")

            # Resize proportionally if wider than the allowed maximum.
            if img.width > MAX_IMAGE_WIDTH:
                ratio = MAX_IMAGE_WIDTH / img.width
                new_height = int(img.height * ratio)
                img = img.resize((MAX_IMAGE_WIDTH, new_height), Image.LANCZOS)

            # Save the processed image back to disk as WebP.
            buffer = io.BytesIO()
            img.save(buffer, format="WEBP", quality=WEBP_QUALITY, method=6)
            buffer.seek(0)

            # Overwrite the file on disk (no second DB save needed).
            self.image.file.close()
            with open(self.image.path, "wb") as f:
                f.write(buffer.read())

        except Exception as exc:
            # Never break the save flow due to image processing errors.
            import logging
            logging.getLogger(__name__).warning(
                "Image optimization failed for product %s: %s", self.pk, exc
            )


class CartItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart_items'
    )
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('user', 'producto')

    def __str__(self):
        return f"{self.cantidad} x {self.producto.name} ({self.user.username})"