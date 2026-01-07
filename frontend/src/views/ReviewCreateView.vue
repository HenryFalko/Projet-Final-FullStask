<template>
  <div class="container">
    <div class="page-header">
      <div class="header-content">
        <i class="mdi mdi-pencil-plus header-icon"></i>
        <h1>Create New Review</h1>
      </div>
      <router-link to="/reviews" class="btn btn-secondary">
        <i class="mdi mdi-arrow-left"></i>
        Back to Reviews
      </router-link>
    </div>
    
    <div class="create-grid">
      <!-- Review Form -->
      <div class="card">
        <h2>
          <i class="mdi mdi-text-box"></i>
          Write Your Review
        </h2>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">
          <i class="mdi mdi-check-circle"></i>
          {{ success }}
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="content">
              <i class="mdi mdi-comment-text"></i>
              Review Content
            </label>
            <textarea
              id="content"
              v-model="form.content"
              rows="8"
              placeholder="Share your experience... (minimum 10 characters)"
              required
              minlength="10"
            ></textarea>
            <small class="char-count">
              <i class="mdi mdi-counter"></i>
              {{ form.content.length }} characters
            </small>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block" :disabled="loading || form.content.length < 10">
            <i v-if="loading" class="mdi mdi-loading mdi-spin"></i>
            <i v-else class="mdi mdi-send"></i>
            {{ loading ? 'Analyzing...' : 'Submit Review' }}
          </button>
        </form>
      </div>
      
      <!-- Analysis Result -->
      <div v-if="analysis" class="card analysis-result">
        <h2>
          <i class="mdi mdi-brain"></i>
          AI Analysis Result
        </h2>
        
        <div class="analysis-item">
          <label>
            <i class="mdi mdi-emoticon"></i>
            Sentiment
          </label>
          <span class="badge" :class="`badge-${analysis.sentiment}`">
            <i v-if="analysis.sentiment === 'positive'" class="mdi mdi-emoticon-happy"></i>
            <i v-else-if="analysis.sentiment === 'negative'" class="mdi mdi-emoticon-sad"></i>
            <i v-else class="mdi mdi-emoticon-neutral"></i>
            {{ analysis.sentiment }}
          </span>
        </div>
        
        <div class="analysis-item">
          <label>
            <i class="mdi mdi-chart-line"></i>
            Score
          </label>
          <div class="score-display">
            <div class="score-bar">
              <div class="score-fill" :style="{ width: analysis.score + '%' }"></div>
            </div>
            <span class="score-value">{{ analysis.score }}/100</span>
          </div>
        </div>
        
        <div v-if="analysis.topics && analysis.topics.length > 0" class="analysis-item">
          <label>
            <i class="mdi mdi-tag-multiple"></i>
            Detected Topics
          </label>
          <div class="topics">
            <span v-for="topic in analysis.topics" :key="topic" class="topic-tag">
              <i class="mdi mdi-tag"></i>
              {{ topic }}
            </span>
          </div>
        </div>
        
        <div v-else class="analysis-item">
          <p class="no-topics">
            <i class="mdi mdi-information-outline"></i>
            No specific topics detected
          </p>
        </div>
        
        <div class="analysis-info">
          <i class="mdi mdi-lightbulb-on"></i>
          <p>This analysis was performed automatically using our AI service!</p>
        </div>
      </div>
      
      <!-- Tips Card -->
      <div v-else class="card tips-card">
        <h3>
          <i class="mdi mdi-lightbulb"></i>
          Tips for Better Reviews
        </h3>
        <ul>
          <li>
            <i class="mdi mdi-check"></i>
            Be specific about your experience
          </li>
          <li>
            <i class="mdi mdi-check"></i>
            Mention aspects like delivery, quality, price, or service
          </li>
          <li>
            <i class="mdi mdi-check"></i>
            Use descriptive words to express your sentiment
          </li>
          <li>
            <i class="mdi mdi-check"></i>
            Write at least 10 characters for accurate analysis
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const loading = ref(false);
const error = ref(null);
const success = ref(null);
const analysis = ref(null);

const form = reactive({
  content: '',
});

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;
    success.value = null;
    
    const response = await api.post('/reviews', {
      content: form.content,
    });
    
    analysis.value = response.data.analysis;
    success.value = 'Review created successfully!';
    
    // Reset form
    form.content = '';
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/reviews');
    }, 2000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create review';
    console.error(err);
  } finally {
    loading.value = false;
  }
};
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

h2, h3 {
  display: flex;
  align-items: center;
  gap: 8px;
}

h2 i, h3 i {
  color: #5f6368;
}

.create-grid {
  display: grid;
  gap: 24px;
}

@media (min-width: 768px) {
  .create-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.char-count {
  display: flex;
  align-items: center;
  gap: 4px;
  text-align: right;
  color: #5f6368;
  margin-top: 8px;
  font-size: 13px;
}

.btn-block {
  width: 100%;
  margin-top: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.analysis-result {
  background: #e8f0fe;
  border-left: 4px solid #1a73e8;
}

.analysis-item {
  margin-bottom: 24px;
}

.analysis-item label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  color: #202124;
  margin-bottom: 8px;
  font-size: 14px;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 16px;
}

.score-bar {
  flex: 1;
  height: 32px;
  background: #dadce0;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: #1a73e8;
  transition: width 0.5s ease;
}

.score-value {
  font-size: 20px;
  font-weight: 500;
  color: #1a73e8;
  min-width: 70px;
}

.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-tag {
  background: #ffffff;
  color: #1a73e8;
  padding: 6px 12px;
  font-weight: 500;
  border: 1px solid #dadce0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.no-topics {
  color: #5f6368;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 8px;
}

.analysis-info {
  margin-top: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #dadce0;
  font-size: 13px;
  color: #5f6368;
  display: flex;
  align-items: center;
  gap: 8px;
}

.analysis-info i {
  color: #fbbc04;
  font-size: 20px;
}

.tips-card {
  background: #fef7e0;
  border-left: 4px solid #fbbc04;
}

.tips-card h3 {
  color: #202124;
  margin-bottom: 16px;
}

.tips-card ul {
  list-style: none;
  padding: 0;
}

.tips-card li {
  padding: 8px 0;
  color: #202124;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tips-card li i {
  color: #34a853;
  font-size: 18px;
}

.mdi-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
