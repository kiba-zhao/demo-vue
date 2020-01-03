<template>
    <div class="container">
        <h3>
            View List
            <small class="text-muted">视图目录</small>
        </h3>
        <div class="list-group">
            <router-link class="list-group-item list-group-item-action" v-for="(link,index) in links" :to="link.path">
                <h6>{{index+1}}. {{link.key}} <small v-show="link.name" class="badge" :class="['badge-primary','badge-secondary','badge-success','badge-danger','badge-warning','badge-info','badge-dark'][index%7]" v-text="link.name"></small></h6>
            </router-link>
        </div>
    </div>
</template>

<script>
 export default {
     props:{
         links:{
             type: Array,
             required: true
         }
     }
 };
</script>

<style scoped>
 @import "../node_modules/bootstrap/dist/css/bootstrap.css"
</style>
