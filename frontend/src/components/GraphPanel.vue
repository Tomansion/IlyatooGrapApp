<template>
  <!-- Full page Graph Panel -->
  <div id="graphPanel" class="" style="height: 100%">
    <!-- Header -->
    <v-app-bar :elevation="3">
      <v-app-bar-title>Ilyatoo Graph visualization</v-app-bar-title>
    </v-app-bar>

    <!-- Item panel button -->
    <v-btn
      color="primary"
      fab
      dark
      fixed
      bottom
      right
      @click="
        itemSelection = true;
        itemSelected = null;
      "
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Item selection panel -->
    <v-dialog width="500" v-model="itemSelection">
      <v-card elevation="3">
        <v-card-title>Select an item</v-card-title>
        <v-card-text>
          <!-- Search filter -->
          <v-text-field
            v-model="itemsSearchFilter"
            label="Filter"
          ></v-text-field>

          <!-- Item list -->
          <v-list style="height: 500px; overflow-y: auto">
            <v-list-item
              v-for="(item, index) in filteredItems"
              :key="index"
              @click="
                itemSelection = false;
                itemSelected = item;
              "
            >
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="itemSelection = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Graph -->
    <v-sheet width="100%" height="100%">
      <div id="graph" style="height: 90vh"></div>
    </v-sheet>
  </div>
</template>

<script>
import { Network } from "vis-network";

import { convertToItemObjects } from "./ItemsGraph";
import axios from "axios";

export default {
  data() {
    return {
      itemSelection: true,
      itemSelected: null,
      items: ["SOLEIL (ESPACE)"],
      itemsSearchFilter: "",
      graphItem: null,
    };
  },
  mounted() {
    this.itemSelection = true;
  },
  methods: {
    displayLinkedItems() {
      if (!this.itemSelected) return;

      console.log("Selected item: ", this.itemSelected);
      // Fetch linked items
      axios
        .get(`/elements/name/${this.itemSelected}`)
        .then((response) => {
          this.graphItem = convertToItemObjects(
            this.itemSelected,
            response.data
          );
          this.displayGraph(this.graphItem);
        })
        .catch((error) => {
          console.error(error);
        });
    },

    displayGraph(graphItem) {
      const data = graphItem.convertToVisData();

      // create a network
      const container = document.getElementById("graph");
      const options = {
        interaction: { hover: true },
        manipulation: {
          enabled: true,
        },
      };
      new Network(container, data, options);

      // network.on("click", (params) => {});
    },
  },

  computed: {
    filteredItems() {
      return this.items.filter((item) =>
        item.toLowerCase().includes(this.itemsSearchFilter.toLowerCase())
      );
    },
  },

  watch: {
    itemSelected() {
      this.displayLinkedItems();
    },
  },
};
</script>
