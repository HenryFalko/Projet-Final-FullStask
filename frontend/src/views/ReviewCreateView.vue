<template>
  <div class="container">
    <div class="create-header">
      <h1>✍️ Create New Review</h1>
      <router-link to="/reviews" class="btn btn-secondary">← Back to Reviews</router-link>
    </div>
    
    <div class="create-grid">
      <!-- Review Form -->
      <div class="card">
        <h2>Write Your Review</h2>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="content">Review Content</label>
            <textarea
              id="content"
              v-model="form.content"
              rows="8"
              placeholder="Share your experience... (minimum 10 characters)"
              required
              minlength="10"
            ></textarea>
            <small class="char-count">{{ form.content.length }} characters</small>
          </div>
          
          <button type="submit" class="btn btn-primary" :disabled="loading || form.content.length < 10">
            {{ loading ? 'Analyzing...' : 'Submit Review' }}
          </button>
        </form>
      </div>
      
      <!-- Analysis Result -->
      <div v-if="analysis" class="card analysis-result">
        <h2>✨ AI Analysis Result</h2>
        
        <div class="analysis-item">
          <label>Sentiment:</label>
          <span class="badge" :class="`badge-${analysis.sentiment}`">{{ analysis.sentiment }}</span>
        </div>
        
        <div class="analysis-item">
          <label>Score:</label>
          <div class="score-display">
            <div class="score-bar">
              <div class="score-fill" :style="{ width: analysis.score + '%' }"></div>
            </div>
            <span class="score-value">{{ analysis.score }}/100</span>
          </div>
        </div>
        
        <div v-if="analysis.topics && analysis.topics.length > 0" class="analysis-item">
          <label>Detected Topics:</label>
          <div class="topics">
            <span v-for="topic in analysis.topics" :key="topic" class="topic-tag">{{ topic }}</span>
          </div>
        </div>
        
        <div v-else class="analysis-item">
          <p class="no-topics">No specific topics detected</p>
        </div>
        
        <div class="analysis-info">
          <p>💡 This analysis was performed automatically using our AI service!</p>
        </div>
      </div>
      
      <!-- Tips Card -->
      <div v-else class="card tips-card">
        <h3>💡 Tips for Better Reviews</h3>
        <ul>
          <li>Be specific about your experience</li>
          <li>Mention aspects like delivery, quality, price, or service</li>
          <li>Use descriptive words to express your sentiment</li>
          <li>Write at least 10 characters for accurate analysis</li>
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
.create-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  color: #1e293b;
}

.create-grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 768px) {
  .create-grid {
    grid-template-columns: 1fr 1fr;
  }
}

h2 {
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.char-count {
  display: block;
  text-align: right;
  color: #64748b;
  margin-top: 0.5rem;
}

.analysis-result {
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
}

.analysis-item {
  margin-bottom: 1.5rem;
}

.analysis-item label {
  display: block;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.5rem;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.score-bar {
  flex: 1;
  height: 32px;
  background: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.5s ease;
}

.score-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #667eea;
  min-width: 70px;
}

.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.topic-tag {
  background: #e0e7ff;
  color: #4338ca;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-weight: 500;
}

.no-topics {
  color: #94a3b8;
  font-style: italic;
}

.analysis-info {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  font-size: 0.875rem;
  color: #475569;
}

.tips-card {
  background: #fef3c7;
}

.tips-card h3 {
  color: #92400e;
  margin-bottom: 1rem;
}

.tips-card ul {
  list-style: none;
  padding: 0;
}

.tips-card li {
  padding: 0.5rem 0;
  color: #78350f;
  position: relative;
  padding-left: 1.5rem;
}

.tips-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #92400e;
  font-weight: bold;
}
</style>
