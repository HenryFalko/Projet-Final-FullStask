<template>
  <div class="container">
    <div class="header">
      <h1>📝 All Reviews</h1>
      <router-link to="/reviews/create" class="btn btn-primary">+ New Review</router-link>
    </div>
    
    <!-- Filters -->
    <div class="card filters">
      <div class="filter-group">
        <label>Sentiment:</label>
        <select v-model="filters.sentiment" @change="fetchReviews">
          <option value="">All</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Min Score:</label>
        <input v-model.number="filters.min_score" type="number" min="0" max="100" @change="fetchReviews" />
      </div>
      
      <div class="filter-group">
        <label>Sort:</label>
        <select v-model="filters.sort" @change="fetchReviews">
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="loading">Loading reviews...</div>
    
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else-if="reviews.length === 0" class="card no-data">
      <p>No reviews found. Create your first review!</p>
    </div>
    
    <div v-else class="reviews-grid">
      <div v-for="review in reviews" :key="review.id" class="card review-card">
        <div class="review-header">
          <span class="badge" :class="`badge-${review.sentiment}`">{{ review.sentiment }}</span>
          <span class="score">{{ review.score }}/100</span>
        </div>
        
        <p class="review-content">{{ review.content }}</p>
        
        <div v-if="review.topics && review.topics.length > 0" class="topics">
          <span v-for="topic in review.topics" :key="topic" class="topic-tag">{{ topic }}</span>
        </div>
        
        <div class="review-footer">
          <span class="author">by {{ review.user?.name }}</span>
          <span class="date">{{ formatDate(review.created_at) }}</span>
        </div>
        
        <div v-if="canDelete(review)" class="review-actions">
          <button @click="deleteReview(review.id)" class="btn btn-danger btn-sm">Delete</button>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="pagination">
      <button 
        @click="changePage(pagination.current_page - 1)" 
        :disabled="pagination.current_page === 1"
        class="btn btn-secondary"
      >
        Previous
      </button>
      <span class="page-info">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
      <button 
        @click="changePage(pagination.current_page + 1)" 
        :disabled="pagination.current_page === pagination.last_page"
        class="btn btn-secondary"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

const authStore = useAuthStore();
const reviews = ref([]);
const loading = ref(true);
const error = ref(null);
const pagination = ref({});

const filters = reactive({
  sentiment: '',
  min_score: '',
  sort: 'desc',
  page: 1,
});

const fetchReviews = async () => {
  try {
    loading.value = true;
    const params = new URLSearchParams();
    
    if (filters.sentiment) params.append('sentiment', filters.sentiment);
    if (filters.min_score) params.append('min_score', filters.min_score);
    if (filters.sort) params.append('sort', filters.sort);
    params.append('page', filters.page);
    
    const response = await api.get(`/reviews?${params.toString()}`);
    reviews.value = response.data.data;
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      total: response.data.total,
    };
  } catch (err) {
    error.value = 'Failed to load reviews';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  filters.page = page;
  fetchReviews();
};

const deleteReview = async (id) => {
  if (!confirm('Are you sure you want to delete this review?')) return;
  
  try {
    await api.delete(`/reviews/${id}`);
    fetchReviews();
  } catch (err) {
    alert('Failed to delete review');
    console.error(err);
  }
};

const canDelete = (review) => {
  return review.user?.id === authStore.user?.id || authStore.isAdmin;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

onMounted(() => {
  fetchReviews();
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  color: #1e293b;
}

.filters {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #334155;
  font-size: 0.875rem;
}

.filter-group select,
.filter-group input {
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  min-width: 150px;
}

.reviews-grid {
  display: grid;
  gap: 1.5rem;
}

.review-card {
  position: relative;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.score {
  font-weight: 600;
  color: #667eea;
  font-size: 1.125rem;
}

.review-content {
  color: #334155;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.topic-tag {
  background: #e0e7ff;
  color: #4338ca;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #64748b;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.review-actions {
  margin-top: 1rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.page-info {
  color: #64748b;
  font-weight: 500;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
}
</style>
