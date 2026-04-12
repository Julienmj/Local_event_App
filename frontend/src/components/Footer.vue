<template>
  <footer class="footer-custom">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h5 class="text-white fw-bold mb-1"><i class="bi bi-calendar-event me-2"></i>EventHub</h5>
          <p class="small mb-0">Connecting communities through events.</p>
        </div>
        <div class="col-md-4 text-center">
          <router-link to="/events" class="text-decoration-none text-white-50 me-3 small">Browse Events</router-link>
          <router-link to="/register" class="text-decoration-none text-white-50 small">Join Us</router-link>
        </div>
        <div class="col-md-4 text-md-end">
          <p class="small mb-0">&copy; 2026 EventHub — Group 12</p>
        </div>
      </div>
    </div>
  </footer>
</template>
