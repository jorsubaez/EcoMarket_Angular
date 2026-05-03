import { Routes } from '@angular/router';
// Importamos tus componentes
import { Inicio } from './inicio/inicio';
import { Catalogo } from './catalogo/catalogo';
import { Contacto } from './contacto/contacto';
import { Detalle } from './detalle/detalle';
import { LoginComponent } from './login/login';
import { Productores } from './productores/productores';
import { RegistroComponent } from './registro/registro';
import { Perfil } from './perfil/perfil';
import { PanelProductor } from './panel-productor/panel-productor';
import { ConfirmarPedidoComponent } from './confirmar-pedido/confirmar-pedido';
import { PagoPedidoComponent } from './pago-pedido/pago-pedido';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'catalogo', component: Catalogo },
  { path: 'contacto', component: Contacto },
  { path: 'detalle', component: Detalle },
  { path: 'login', component: LoginComponent },
  { path: 'productores', component: Productores },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
  { path: 'panel-productor', component: PanelProductor, canActivate: [authGuard] },
  { path: 'confirmar-pedido', component: ConfirmarPedidoComponent, canActivate: [authGuard] },
  { path: 'pago-pedido/:id', component: PagoPedidoComponent, canActivate: [authGuard] },
];
