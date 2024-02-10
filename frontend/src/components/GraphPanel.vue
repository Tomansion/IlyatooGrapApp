<template>
  <!-- Full page Graph Panel -->
  <div
    id="graphPanel"
    class="d-flex align-center justify-center"
    style="height: 100%"
  >
    <!-- Header -->
    <v-app-bar :elevation="3">
      <v-app-bar-title>Ilyatoo Graph visualization</v-app-bar-title>
    </v-app-bar>

    <!-- Item selection panel -->
    <!-- <v-overlay :value="itemSelection" opacity="0.6">
    
    </v-overlay> -->

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
              @click="itemSelection = false"
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
import { DataSet } from "vis-data";

export default {
  data() {
    return {
      itemSelection: false,
      itemSelected: null,
      items: [
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
        "Soleil (ESPACE)",
      ],
      itemsSearchFilter: "",
    };
  },
  mounted() {
    this.setupGraph();

    this.itemSelection = true;
  },
  methods: {
    setupGraph() {
      const nodes = new DataSet([
        { id: 1, label: "Node 1" },
        { id: 2, label: "Node 2" },
        { id: 3, label: "Node 3" },
        { id: 4, label: "Node 4" },
        { id: 5, label: "Node 5" },
      ]);

      // create an array with edges
      const edges = new DataSet([
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 3 },
      ]);

      // create a network
      const container = document.getElementById("graph");
      const data = {
        nodes: nodes,
        edges: edges,
      };
      const options = {
        interaction: { hover: true },
        manipulation: {
          enabled: true,
        },
      };
      const network = new Network(container, data, options);

      network.on("click", (params) => {
        this.itemSelected = params.nodes[0];
        console.log(this.itemSelected);
        this.itemSelection = !this.itemSelection;
        console.log(this.itemSelection);
      });
    },
  },

  computed: {
    filteredItems() {
      return this.items.filter((item) =>
        item.toLowerCase().includes(this.itemsSearchFilter.toLowerCase())
      );
    },
  },
};
</script>
