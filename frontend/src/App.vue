<template>
  <div id="app">
    <nav v-if="authStore.isAuthenticated" class="navbar">
      <div class="nav-container">
        <div class="nav-left">
          <router-link to="/dashboard" class="logo">
            <i class="mdi mdi-chart-box logo-icon"></i>
            <span class="logo-text">Review Analysis</span>
          </router-link>
        </div>
        <div class="nav-links">
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          <router-link to="/reviews" class="nav-link">Reviews</router-link>
          <router-link to="/reviews/create" class="nav-link">New Review</router-link>
          <button @click="handleLogout" class="btn-logout">Logout</button>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  background: #ffffff;
  border-bottom: 1px solid #dadce0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.nav-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #202124;
  font-weight: 500;
  font-size: 20px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-weight: 400;
}

.nav-links {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-link {
  color: #5f6368;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 16px;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.25px;
}

.nav-link:hover {
  color: #202124;
  background: #f8f9fa;
}

.nav-link.router-link-active {
  color: #1a73e8;
  border-bottom: 2px solid #1a73e8;
}

.btn-logout {
  background: transparent;
  color: #1a73e8;
  border: 1px solid #dadce0;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.25px;
  margin-left: 8px;
}

.btn-logout:hover {
  background: #f8f9fa;
}

.main-content {
  min-height: calc(100vh - 64px);
  background: #f8f9fa;
}
</style>
