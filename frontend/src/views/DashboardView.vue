<template>
  <div class="container">
    <div class="page-header">
      <div class="header-content">
        <i class="mdi mdi-view-dashboard header-icon"></i>
        <h1>Dashboard</h1>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      <i class="mdi mdi-loading mdi-spin"></i>
      Loading dashboard...
    </div>
    
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else class="dashboard-grid">
      <!-- Statistics Cards -->
      <div class="stats-row">
        <div class="stat-card card">
          <div class="stat-icon">
            <i class="mdi mdi-file-document-multiple"></i>
          </div>
          <h3>Total Reviews</h3>
          <p class="stat-number">{{ stats.total_reviews }}</p>
        </div>
        
        <div class="stat-card card">
          <div class="stat-icon">
            <i class="mdi mdi-chart-line"></i>
          </div>
          <h3>Average Score</h3>
          <p class="stat-number">{{ stats.average_score }}/100</p>
        </div>
        
        <div class="stat-card card">
          <div class="stat-icon positive">
            <i class="mdi mdi-thumb-up"></i>
          </div>
          <h3>Positive</h3>
          <p class="stat-number positive">{{ stats.sentiment_distribution?.percentages?.positive || 0 }}%</p>
        </div>
        
        <div class="stat-card card">
          <div class="stat-icon negative">
            <i class="mdi mdi-thumb-down"></i>
          </div>
          <h3>Negative</h3>
          <p class="stat-number negative">{{ stats.sentiment_distribution?.percentages?.negative || 0 }}%</p>
        </div>
      </div>
      
      <!-- Sentiment Distribution -->
      <div class="card">
        <h2>
          <i class="mdi mdi-chart-bar"></i>
          Sentiment Distribution
        </h2>
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
        <h2>
          <i class="mdi mdi-tag-multiple"></i>
          Top Topics
        </h2>
        <div v-if="stats.top_topics && stats.top_topics.length > 0" class="topics-list">
          <div v-for="topic in stats.top_topics" :key="topic.topic" class="topic-item">
            <span class="topic-name">
              <i class="mdi mdi-tag"></i>
              {{ topic.topic }}
            </span>
            <span class="topic-count">{{ topic.count }} mentions</span>
          </div>
        </div>
        <p v-else class="no-data">
          <i class="mdi mdi-information-outline"></i>
          No topics detected yet
        </p>
      </div>
      
      <!-- Recent Reviews -->
      <div class="card">
        <h2>
          <i class="mdi mdi-clock-outline"></i>
          Recent Reviews
        </h2>
        <div v-if="stats.recent_reviews && stats.recent_reviews.length > 0" class="reviews-list">
          <div v-for="review in stats.recent_reviews" :key="review.id" class="review-item">
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
            <div class="review-meta">
              <span>
                <i class="mdi mdi-account"></i>
                {{ review.user?.name }}
              </span>
              <span>
                <i class="mdi mdi-calendar"></i>
                {{ formatDate(review.created_at) }}
              </span>
            </div>
          </div>
        </div>
        <p v-else class="no-data">
          <i class="mdi mdi-information-outline"></i>
          No reviews yet
        </p>
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
.page-header {
  margin-bottom: 32px;
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

h2 {
  display: flex;
  align-items: center;
  gap: 8px;
}

h2 i {
  color: #5f6368;
}

.dashboard-grid {
  display: grid;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.stat-card {
  text-align: center;
  position: relative;
}

.stat-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8f0fe;
  color: #1a73e8;
}

.stat-icon i {
  font-size: 24px;
}

.stat-icon.positive {
  background: #e6f4ea;
  color: #137333;
}

.stat-icon.negative {
  background: #fce8e6;
  color: #c5221f;
}

.stat-card h3 {
  color: #5f6368;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.stat-number {
  font-size: 32px;
  font-weight: 400;
  color: #202124;
}

.stat-number.positive {
  color: #137333;
}

.stat-number.negative {
  color: #c5221f;
}

.sentiment-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}

.sentiment-bar {
  display: grid;
  grid-template-columns: 100px 1fr 60px;
  align-items: center;
  gap: 16px;
}

.label {
  font-weight: 500;
  color: #202124;
  font-size: 14px;
}

.bar {
  height: 32px;
  background: #f1f3f4;
  overflow: hidden;
}

.fill {
  height: 100%;
  transition: width 0.5s ease;
}

.fill.positive {
  background: #34a853;
}

.fill.neutral {
  background: #9aa0a6;
}

.fill.negative {
  background: #ea4335;
}

.percentage {
  text-align: right;
  font-weight: 500;
  color: #5f6368;
}

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.topic-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: #f8f9fa;
  border-left: 4px solid #1a73e8;
}

.topic-name {
  font-weight: 500;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 8px;
}

.topic-name i {
  color: #1a73e8;
}

.topic-count {
  color: #5f6368;
  font-size: 14px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}

.review-item {
  padding: 16px;
  background: #f8f9fa;
  border-left: 4px solid #dadce0;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.score {
  font-weight: 500;
  color: #1a73e8;
}

.review-content {
  margin: 12px 0;
  color: #202124;
  line-height: 1.6;
}

.review-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #5f6368;
  padding-top: 12px;
  border-top: 1px solid #dadce0;
}

.review-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.review-meta i {
  font-size: 16px;
}

.no-data {
  text-align: center;
  color: #5f6368;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 16px;
}

.mdi-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
