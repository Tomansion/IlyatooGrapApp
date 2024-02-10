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
            label="Search item"
            outlined
            clearable
            append-inner-icon="mdi-magnify"
          />

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
import { DataSet } from "vis-data";

import { convertToItemObjects, itemsMemory } from "./ItemsGraph";
import axios from "axios";

export default {
  data() {
    return {
      itemSelection: true,
      itemSelected: null,
      items: [
        "SOLEIL (ESPACE)",
        "POLITIQUE",
        "ENVIRONNEMENT",
        "LANGAGE NATUREL",
      ],
      itemsSearchFilter: "",
      graphItem: null,
      nodes: null,
      edges: null,
      network: null,
    };
  },
  mounted() {
    this.itemSelection = true;
    this.nodes = new DataSet([]);
    this.edges = new DataSet([]);
    this.initGraph();
  },
  methods: {
    displayLinkedItems() {
      if (!this.itemSelected) return;

      // Fetch linked items
      axios
        .get(`/elements/name/${this.itemSelected}`)
        .then((response) => {
          this.graphItem = convertToItemObjects(
            this.itemSelected,
            response.data
          );
          this.addNodesAndEdges(this.graphItem);
        })
        .catch((error) => {
          console.error(error);
        });
    },

    addNodesAndEdges(graphItem, isUpdate = false) {
      const nodes = [];
      const edges = [];
      graphItem.convertToVisData(nodes, edges);

      // Update the nodes and edges datasets
      if (isUpdate) {
        // Remove the graphItem node
        const filteredNodes = nodes.filter((node) => {
          return node.label !== graphItem.label;
        });
        this.nodes.add(filteredNodes);
        this.edges.add(edges);
      } else {
        this.nodes.update(nodes);
        this.edges.update(edges);
      }

      console.log("Nodes: ", nodes);
      console.log("Edges: ", edges);
    },

    initGraph() {
      const data = {
        nodes: this.nodes,
        edges: this.edges,
      };

      // create a network
      const container = document.getElementById("graph");
      const options = {
        interaction: { hover: true },
        manipulation: {
          enabled: true,
        },
      };
      this.network = new Network(container, data, options);

      this.network.on("click", (params) => {
        if (params.nodes.length > 0) this.addLinkedItemsToItem(params.nodes[0]);
      });
    },

    addLinkedItemsToItem(itemName) {
      const selectedItem = itemsMemory[itemName];
      if (!selectedItem) {
        console.error("Item not found in memory: ", itemName);
        return;
      }

      if (selectedItem.links.length > 0) return;

      axios
        .get(`/elements/name/${itemName}`)
        .then((response) => {
          if (response.data.length === 0) return;
          selectedItem.addLinks(response.data);
          this.addNodesAndEdges(selectedItem, true);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },

  computed: {
    filteredItems() {
      if (!this.itemsSearchFilter) return this.items;

      return this.items.filter((item) =>
        item.toLowerCase().includes(this.itemsSearchFilter.toLowerCase())
      );
    },
  },

  watch: {
    itemSelected() {
      this.nodes.clear();
      this.edges.clear();
      this.initGraph();
      this.displayLinkedItems();
    },
  },
};
</script>
