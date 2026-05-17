<script setup lang="ts">
const props = defineProps<{
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
}>();

const emit = defineEmits<{
  (e: "update:page", value: number): void;
}>();

function changePage(p: number) {
  if (p < 1 || p > props.totalPages || p === props.page) return;
  emit("update:page", p);
}
</script>

<template>
  <div v-if="totalPages > 1" class="pagination-wrapper">
    <div class="pagination-info">
      Mostrando página
      <strong>{{ page }}</strong>
      de
      <strong>{{ totalPages }}</strong>
      ({{ total }} produtos no total)
    </div>

    <v-pagination
      :model-value="page"
      :length="totalPages"
      :total-visible="5"
      color="primary"
      variant="elevated"
      density="comfortable"
      @update:model-value="changePage"
    />
  </div>
</template>

<style scoped>
.pagination-wrapper {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.pagination-info {
  color: #b5b5b5;
  font-size: 14px;
}

.pagination-info strong {
  color: var(--cica-white);
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
}
</style>
