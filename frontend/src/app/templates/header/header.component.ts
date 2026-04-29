import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  
  cartItems: CartItem[] = [];
  cartCount = 0;
  cartTotal = 0;
  isCartDrawerOpen = false;
  bumpCart = false;

  constructor(private cartService: CartService, public authService: AuthService) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.cartCount = this.cartService.getCartCount();
      this.cartTotal = this.cartService.getCartTotal();
      
      if (this.cartCount > 0) {
        this.triggerCartBump();
      }
    });
  }

  toggleCartDrawer(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.isCartDrawerOpen = !this.isCartDrawerOpen;
    if (this.isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  updateQuantity(productoId: number, cantidad: number) {
    this.cartService.updateQuantity(productoId, cantidad);
  }

  removeItem(productoId: number) {
    this.cartService.removeFromCart(productoId);
  }

  triggerCartBump() {
    this.bumpCart = true;
    setTimeout(() => {
      this.bumpCart = false;
    }, 300);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
