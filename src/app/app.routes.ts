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

export const routes: Routes = [
  { path: '', component: Inicio }, // Página principal (vacía)
  { path: 'catalogo', component: Catalogo }, // ecomarket.com/catalogo
  { path: 'contacto', component: Contacto }, // ecomarket.com/contacto
  { path: 'detalle', component: Detalle }, // ecomarket.com/detalle
  { path: 'login', component: LoginComponent }, // Si escriben cualquier otra cosa, vuelve al inicio
  { path: 'productores', component: Productores },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: Perfil },
  { path: 'panel-productor', component: PanelProductor },
];
