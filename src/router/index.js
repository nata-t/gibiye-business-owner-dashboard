import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const isValidToken = () => {
    const loggedUser = Cookies.get('loggedUser') ? Cookies.get('loggedUser') : null;
    const parsedUser = JSON.parse(loggedUser);
    const token = parsedUser ? parsedUser.token : null;
    return token !== null && token !== undefined;
};

const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
};

const globalGuard = (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        const loggedUser = Cookies.get('loggedUser') ? Cookies.get('loggedUser') : null;
        const parsedUser = JSON.parse(loggedUser);
        const token = parsedUser ? parsedUser.token : null;
        if (!isValidToken() || (token && isTokenExpired(token))) {
            next({ name: 'login' });
        } else {
            next();
        }
    } else {
        next();
    }
};

const routes = [
    {
        path: '/',
        component: AppLayout,
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: '/',
                name: 'analysis',
                component: () => import('@/views/new/Placeholder.vue')
            },
            {
                path: '/service-management/service',
                name: 'service',
                component: () => import('@/views/new/Service.vue')
            },
            {
                path: '/service-management/new',
                name: 'new-service',
                component: () => import('@/views/new/NewService.vue')
            },
            {
                path: '/scheduling/appointment',
                name: 'appointment',
                component: () => import('@/views/new/Appointment.vue')
            },
            {
                path: '/scheduling/calendar',
                name: 'calendar',
                component: () => import('@/views/new/CalenderView.vue')
            },
            {
                path: '/profile-management/posts-comments',
                name: 'posts-comments',
                component: () => import('@/views/new/PostAndComments.vue')
            },
            {
                path: '/profile-management/compose',
                name: 'compose',
                component: () => import('@/views/new/Compose.vue')
            },
            {
                path: '/pages/empty',
                name: 'empty',
                component: () => import('@/views/pages/Empty.vue')
            }
        ]
    },
    {
        path: '/pages/notfound',
        name: 'notfound',
        component: () => import('@/views/pages/NotFound.vue')
    },

    {
        path: '/auth/login',
        name: 'login',
        component: () => import('@/views/pages/auth/Login.vue')
    },
    {
        path: '/auth/access',
        name: 'accessDenied',
        component: () => import('@/views/pages/auth/AccessDenied.vue')
    },
    {
        path: '/auth/error',
        name: 'error',
        component: () => import('@/views/pages/auth/Error.vue')
    },
    {
        path: '/auth/register',
        name: 'register',
        component: () => import('@/views/pages/auth/Register.vue')
    },
    {
        path: '/auth/forgotpassword',
        name: 'forgotpassword',
        component: () => import('@/views/pages/auth/ForgotPassword.vue')
    },
    {
        path: '/auth/newpassword',
        name: 'newpassword',
        component: () => import('@/views/pages/auth/NewPassword.vue')
    },
    {
        path: '/auth/verification',
        name: 'verification',
        component: () => import('@/views/pages/auth/Verification.vue')
    },
    {
        path: '/auth/lockscreen',
        name: 'lockscreen',
        component: () => import('@/views/pages/auth/LockScreen.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: () => import('@/views/pages/NotFound.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { left: 0, top: 0 };
    }
});

router.beforeEach(globalGuard);

export default router;
