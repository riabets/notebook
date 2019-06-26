<template>
  <div id="app">
    <notes></notes>
  </div>
</template>

<script>
import Index from "@/components/Index";
export default {
  name: 'app',
  components: {
    'notes':Index,
  }
}
</script>

<style>
body {
  margin:0;
  padding:0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-wrap: wrap;
  width:100%;
}
</style>
