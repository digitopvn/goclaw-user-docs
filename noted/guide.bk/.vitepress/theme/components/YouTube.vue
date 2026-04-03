<script setup>
defineProps({
  id: { type: String, required: true },
  title: { type: String, default: 'Video' },
})
</script>

<template>
  <div class="youtube-embed">
    <iframe
      :src="`https://www.youtube.com/embed/${id}`"
      :title="title"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>

<style scoped>
.youtube-embed {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  margin: 16px 0;
}
.youtube-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
</style>
