<template>
  <div class="container">
    <div class="page-header">
      <div class="header-content">
        <i class="mdi mdi-file-document-multiple header-icon"></i>
        <h1>All Reviews</h1>
      </div>
      <router-link to="/reviews/create" class="btn btn-primary">
        <i class="mdi mdi-plus"></i>
        New Review
      </router-link>
    </div>
    
    <!-- Filters -->
    <div class="card filters">
      <div class="filter-group">
        <label>
          <i class="mdi mdi-filter"></i>
          Sentiment
        </label>
        <select v-model="filters.sentiment" @change="fetchReviews">
          <option value="">All</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>
          <i class="mdi mdi-chart-line"></i>
          Min Score
        </label>
        <input v-model.number="filters.min_score" type="number" min="0" max="100" @change="fetchReviews" />
      </div>
      
      <div class="filter-group">
        <label>
          <i class="mdi mdi-sort"></i>
          Sort
        </label>
        <select v-model="filters.sort" @change="fetchReviews">
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      <i class="mdi mdi-loading mdi-spin"></i>
      Loading reviews...
    </div>
    
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else-if="reviews.length === 0" class="card no-data">
      <i class="mdi mdi-information-outline"></i>
      <p>No reviews found. Create your first review!</p>
    </div>
    
    <div v-else class="reviews-grid">
      <div v-for="review in reviews" :key="review.id" class="card review-card">
        <div class="review-header">
          <span class="badge" :class="`badge-${review.sentiment}`">
            <i v-if="review.sentiment === 'positive'" class="mdi mdi-emoticon-happy"></i>
            <i v-else-if="review.sentiment === 'negative'" class="mdi mdi-emoticon-sad"></i>
            <i v-else class="mdi mdi-emoticon-neutral"></i>
            {{ review.sentiment }}
          </span>
          <span class="score">{{ review.score }}/100</span>
        </div>
        
        <p class="review-content">{{ review.content }}</p>
        
        <div v-if="review.topics && review.topics.length > 0" class="topics">
          <span v-for="topic in review.topics" :key="topic" class="topic-tag">
            <i class="mdi mdi-tag"></i>
            {{ topic }}
          </span>
        </div>
        
        <div class="review-footer">
          <span class="author">
            <i class="mdi mdi-account"></i>
            {{ review.user?.name }}
          </span>
          <span class="date">
            <i class="mdi mdi-calendar"></i>
            {{ formatDate(review.created_at) }}
          </span>
        </div>
        
        <div v-if="canDelete(review)" class="review-actions">
          <button @click="deleteReview(review.id)" class="btn btn-danger btn-sm">
            <i class="mdi mdi-delete"></i>
            Delete
          </button>
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
        <i class="mdi mdi-chevron-left"></i>
        Previous
      </button>
      <span class="page-info">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
      <button 
        @click="changePage(pagination.current_page + 1)" 
        :disabled="pagination.current_page === pagination.last_page"
        class="btn btn-secondary"
      >
        Next
        <i class="mdi mdi-chevron-right"></i>
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
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 32px;
  color: #1a73e8;
}

h1 {
  margin: 0;
}

.filters {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;
}

.filter-group label {
  font-weight: 500;
  color: #202124;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-group label i {
  font-size: 16px;
  color: #5f6368;
}

.filter-group select,
.filter-group input {
  padding: 8px 12px;
  border: 1px solid #dadce0;
  min-width: 150px;
}

.reviews-grid {
  display: grid;
  gap: 16px;
}

.review-card {
  position: relative;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.score {
  font-weight: 500;
  color: #1a73e8;
  font-size: 16px;
}

.review-content {
  color: #202124;
  line-height: 1.6;
  margin-bottom: 16px;
}

.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.topic-tag {
  background: #e8f0fe;
  color: #1a73e8;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #5f6368;
  padding-top: 16px;
  border-top: 1px solid #dadce0;
}

.review-footer span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.review-actions {
  margin-top: 16px;
}

.btn-sm {
  padding: 6px 16px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
}

.page-info {
  color: #5f6368;
  font-weight: 500;
  font-size: 14px;
}

.pagination .btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.no-data {
  text-align: center;
  padding: 48px;
  color: #5f6368;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.no-data i {
  font-size: 48px;
  color: #dadce0;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px;
}

.mdi-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
