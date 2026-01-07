<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Sign in</h1>
        <p class="subtitle">to continue to Review Analysis</p>
      </div>
      
      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button type="submit" class="btn btn-primary btn-block" :disabled="authStore.loading">
          {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <span>Don't have an account?</span>
        <router-link to="/register" class="link">Create account</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  email: '',
  password: '',
});

const handleLogin = async () => {
  try {
    await authStore.login(form.email, form.password);
    router.push('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  background: #ffffff;
  border: 1px solid #dadce0;
  padding: 48px 40px 36px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-header h1 {
  font-size: 24px;
  font-weight: 400;
  color: #202124;
  margin-bottom: 8px;
}

.subtitle {
  color: #5f6368;
  font-size: 16px;
}

.btn-block {
  width: 100%;
  margin-top: 24px;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #dadce0;
  color: #5f6368;
  font-size: 14px;
}

.link {
  color: #1a73e8;
  text-decoration: none;
  font-weight: 500;
  margin-left: 8px;
}

.link:hover {
  text-decoration: underline;
}
</style>
