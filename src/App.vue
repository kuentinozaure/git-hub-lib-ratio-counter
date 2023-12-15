<template>
  <div class="github-issues-app">
    <h1 class="app-title">✨ GitHub lib ratio counter ✨</h1>
    <div class="repo-input">
      <label for="repoName">Enter Repository Name:</label>
      <input type="text" id="repoName" v-model="repoName" placeholder="e.g., owner/repo" @keyup.enter="fetchIssues" />
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      <button @click="fetchIssues">Fetch Issues</button>
    </div>
    <div v-if="loading">{{ currentLoadingMessage }}</div>
    <div class="issue-counts" v-if="!loading && !errorMessage">
      <div class="open-issues">
        <h2>Open Issues:</h2>
        <p>{{ numberOfOpenIssues !== null ? numberOfOpenIssues : "-" }}</p>
      </div>
      <div class="closed-issues">
        <h2>Closed Issues:</h2>
        <p>{{ numberOfClosedIssues !== null ? numberOfClosedIssues : "-" }}</p>
      </div>
    </div>

    <div class="issue-ratio" v-if="!loading && numberOfOpenIssues !== null && numberOfClosedIssues !== null">
      <h2>Lib ratio</h2>
      <p :style="{ color: calculateColorForRatio }" v-if="!showRatioMessage">
        {{ calculateRatioAsPercentage }}
      </p>
      <p v-if="showRatioMessage">{{ currentRatioMessage }}</p>
    </div>
  </div>
</template>
<script>
import { extractTotalCount } from "./utils";
export default {
  data() {
    return {
      repoName: "",
      numberOfOpenIssues: null,
      numberOfClosedIssues: null,
      loading: false,
      errorMessage: null,
      currentRatioMessage: "",
      showRatioMessage: false,
      showLoadingMessage: false,
      currentLoadingMessage: "",
    };
  },

  mounted() { },

  computed: {
    calculateRatioAsPercentage() {
      const totalIssues = this.numberOfOpenIssues + this.numberOfClosedIssues;

      if (totalIssues !== 0) {
        const ratio = (this.numberOfClosedIssues / totalIssues) * 100;
        return Math.ceil(ratio) + "%";
      } else {
        return "0%";
      }
    },

    calculateColorForRatio() {
      const totalIssues = this.numberOfOpenIssues + this.numberOfClosedIssues;

      if (totalIssues !== 0) {
        const ratio = (this.numberOfClosedIssues / totalIssues) * 100;
        return this.getColorForPercentage(ratio);
      } else {
        return "black"; // Adjust the default color as needed
      }
    },
  },

  methods: {
    async fetchIssues() {
      this.loading = true;
      this.showLoadingMessage = true;
      this.currentLoadingMessage = this.getRandomLoadingMessage();

      const intervalLoadingMessage = setInterval(() => {
        this.currentLoadingMessage = this.getRandomLoadingMessage();
      }, 500);


      await this.getOpenIssueCount();
      await this.getClosedIssueCount();
      this.showLoadingMessage = false;
      clearInterval(intervalLoadingMessage);
      this.loading = false;

      this.showRatioMessage = true;
      this.currentRatioMessage = this.getRandomRatioMessage();


      const intervalRatioMessage = setInterval(() => {
        this.currentRatioMessage = this.getRandomRatioMessage();
      }, 500);

      // Clear the interval after 4 seconds
      setTimeout(() => {
        clearInterval(intervalRatioMessage);
        this.showRatioMessage = false;
      }, 4000);
    },

    getRandomRatioMessage() {
      const messages = [
        "Analyzing the ratio with precision and grace. 📊✨",
        "This ratio, a TED Talk in itself. 🎤🌟",
        "A mathematical masterpiece. 🎨🧑‍🎨",
        "Elegance in mathematical calculation. 👨‍🏫🔍",
        "In ratios, this is the Mozart. 🎻🎶",
        "So refined, it has its own monocle. 🧐🔍",
        "Where precision meets perfection. 💎🌟",
        "Sophisticated ratio computing. 🌐💼",
        "Top hat and tails in the realm of ratios. 🎩👔🎶",
        "A dignified ratio deserving its own symphony. 🎻🎼",
      ];

      return messages[Math.floor(Math.random() * messages.length)];
    },

    getRandomLoadingMessage() {
      const messages = [
        "Crafting a loading masterpiece... 🔄",
        "Summoning loading brilliance... 🌐",
        "Aligning stars for a smooth load... ✨",
        "Brewing a loading potion... 🧪",
        "Mastering loading elegance... 🎭",
        "Enlightening the loading path... 💡",
        "Embarking on loading excellence... 🚀",
        "Orchestrating loading ballet... 💃",
        "Invoking loading spirits... 👻",
        "Sculpting a loading masterpiece... 🖌️",
      ];

      return messages[Math.floor(Math.random() * messages.length)];
    },

    async getOpenIssueCount() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${this.repoName}/issues?state=open&per_page=100`
        );
        const linkHeader = response.headers.get("Link");
        this.numberOfOpenIssues = await extractTotalCount(
          this.repoName,
          linkHeader,
          true
        );
      } catch (error) {
        this.errorMessage =
          "Error fetching issue data. Please check the repository name.";
      }
    },

    async getClosedIssueCount() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${this.repoName}/issues?state=closed&per_page=100`
        );
        const linkHeader = response.headers.get("Link");
        this.numberOfClosedIssues = await extractTotalCount(
          this.repoName,
          linkHeader,
          false
        );
      } catch (error) {
        this.errorMessage =
          "Error fetching issue data. Please check the repository name.";
      }
    },

    getColorForPercentage(percentage) {
      if (percentage >= 0 && percentage <= 10) {
        return "red";
      } else if (percentage > 10 && percentage <= 30) {
        return "lightcoral";
      } else if (percentage > 30 && percentage <= 50) {
        return "yellow";
      } else if (percentage > 50 && percentage <= 70) {
        return "lightgreen";
      } else if (percentage > 70 && percentage <= 90) {
        return "green";
      } else if (percentage > 90 && percentage <= 100) {
        return "darkgreen";
      } else {
        return "black"; // Adjust the default color as needed
      }
    },
  },
};
</script>

<style lang="scss">
@import "./App.scss";
</style>
