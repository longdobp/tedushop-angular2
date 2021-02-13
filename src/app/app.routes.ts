import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guards';

export const appRoutes: Routes = [
    //localhost:4200
    { path: '', redirectTo: 'main/home', pathMatch: 'full' },
    { path: 'main', redirectTo: 'main/home', pathMatch: 'full' },
    //localhost:4200/login
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    //localhost:4200/main
    {
        path: 'main', loadChildren: './main/main.module#MainModule',
        canActivate: [AuthGuard]
    }
]