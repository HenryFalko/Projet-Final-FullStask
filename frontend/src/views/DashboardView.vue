<template>
  <div class="container">
    <h1>📊 Dashboard</h1>
    
    <div v-if="loading" class="loading">Loading dashboard...</div>
    
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else class="dashboard-grid">
      <!-- Statistics Cards -->
      <div class="stats-row">
        <div class="stat-card card">
          <h3>Total Reviews</h3>
          <p class="stat-number">{{ stats.total_reviews }}</p>
        </div>
        
        <div class="stat-card card">
          <h3>Average Score</h3>
          <p class="stat-number">{{ stats.average_score }}/100</p>
        </div>
        
        <div class="stat-card card">
          <h3>Positive</h3>
          <p class="stat-number positive">{{ stats.sentiment_distribution?.percentages?.positive || 0 }}%</p>
        </div>
        
        <div class="stat-card card">
          <h3>Negative</h3>
          <p class="stat-number negative">{{ stats.sentiment_distribution?.percentages?.negative || 0 }}%</p>
        </div>
      </div>
      
      <!-- Sentiment Distribution -->
      <div class="card">
        <h2>Sentiment Distribution</h2>
        <div class="sentiment-bars">
          <div class="sentiment-bar">
            <span class="label">Positive</span>
            <div class="bar">
              <div class="fill positive" :style="{ width: stats.sentiment_distribution?.percentages?.positive + '%' }"></div>
            </div>
            <span class="percentage">{{ stats.sentiment_distribution?.percentages?.positive || 0 }}%</span>
          </div>
          
          <div class="sentiment-bar">
            <span class="label">Neutral</span>
            <div class="bar">
              <div class="fill neutral" :style="{ width: stats.sentiment_distribution?.percentages?.neutral + '%' }"></div>
            </div>
            <span class="percentage">{{ stats.sentiment_distribution?.percentages?.neutral || 0 }}%</span>
          </div>
          
          <div class="sentiment-bar">
            <span class="label">Negative</span>
            <div class="bar">
              <div class="fill negative" :style="{ width: stats.sentiment_distribution?.percentages?.negative + '%' }"></div>
            </div>
            <span class="percentage">{{ stats.sentiment_distribution?.percentages?.negative || 0 }}%</span>
          </div>
        </div>
      </div>
      
      <!-- Top Topics -->
      <div class="card">
        <h2>Top Topics</h2>
        <div v-if="stats.top_topics && stats.top_topics.length > 0" class="topics-list">
          <div v-for="topic in stats.top_topics" :key="topic.topic" class="topic-item">
            <span class="topic-name">{{ topic.topic }}</span>
            <span class="topic-count">{{ topic.count }} mentions</span>
          </div>
        </div>
        <p v-else class="no-data">No topics detected yet</p>
      </div>
      
      <!-- Recent Reviews -->
      <div class="card">
        <h2>Recent Reviews</h2>
        <div v-if="stats.recent_reviews && stats.recent_reviews.length > 0" class="reviews-list">
          <div v-for="review in stats.recent_reviews" :key="review.id" class="review-item">
            <div class="review-header">
              <span class="badge" :class="`badge-${review.sentiment}`">{{ review.sentiment }}</span>
              <span class="score">{{ review.score }}/100</span>
            </div>
            <p class="review-content">{{ review.content }}</p>
            <div class="review-meta">
              <span>by {{ review.user?.name }}</span>
              <span>{{ formatDate(review.created_at) }}</span>
            </div>
          </div>
        </div>
        <p v-else class="no-data">No reviews yet</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const stats = ref({});
const loading = ref(true);
const error = ref(null);

const fetchDashboard = async () => {
  try {
    loading.value = true;
    const response = await api.get('/dashboard');
    stats.value = response.data;
  } catch (err) {
    error.value = 'Failed to load dashboard data';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

onMounted(() => {
  fetchDashboard();
});
</script>

<style scoped>
h1 {
  margin-bottom: 2rem;
  color: #1e293b;
}

.dashboard-grid {
  display: grid;
  gap: 2rem;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  text-align: center;
}

.stat-card h3 {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1e293b;
}

.stat-number.positive {
  color: #10b981;
}

.stat-number.negative {
  color: #ef4444;
}

.sentiment-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.sentiment-bar {
  display: grid;
  grid-template-columns: 100px 1fr 60px;
  align-items: center;
  gap: 1rem;
}

.bar {
  height: 32px;
  background: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.fill {
  height: 100%;
  transition: width 0.5s ease;
}

.fill.positive {
  background: linear-gradient(90deg, #10b981, #059669);
}

.fill.neutral {
  background: linear-gradient(90deg, #94a3b8, #64748b);
}

.fill.negative {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.topic-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.topic-name {
  font-weight: 600;
  text-transform: capitalize;
}

.topic-count {
  color: #64748b;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.review-item {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.score {
  font-weight: 600;
  color: #667eea;
}

.review-content {
  margin: 0.75rem 0;
  color: #334155;
}

.review-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #64748b;
}

.no-data {
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
}
</style>
