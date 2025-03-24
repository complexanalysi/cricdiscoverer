import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
      import {
        getFirestore,
        collection,
        getDocs,
      } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

      const firebaseConfig = {
        apiKey: "AIzaSyALIqeWaSFdFMY4xJBpBZIZFcEpANR-ez0",
        authDomain: "cricdiscoverer.firebaseapp.com",
        projectId: "cricdiscoverer",
        storageBucket: "cricdiscoverer.firebasestorage.app",
        messagingSenderId: "1084334510579",
        appId: "1:1084334510579:web:79045656ca40c873414286",
        measurementId: "G-SYR41JGBJ1",
      };

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      let literatureData = [];
      let predictedData;

      async function fetchLiteratureData() {
        const querySnapshot = await getDocs(collection(db, "literature_data"));
        const querySnapshot2 = await getDocs(collection(db, "predicted_data"));
        literatureData = []; // Clear previous data
        predictedData = [];

        querySnapshot.forEach((doc) => {
          literatureData.push(doc.data());
        });

        querySnapshot2.forEach((doc) => {
          predictedData = doc.data();
        });

        renderLiteratureTable(literatureData);
      }

      function renderLiteratureTable(data) {
        let tableBody = document.getElementById("litProteinDetails");
        tableBody.innerHTML = "";

        if (data.length === 0) {
          tableBody.innerHTML =
            "<tr><td colspan='8'>No results found</td></tr>";
          return;
        }

        data.forEach((item) => {
          let row = `<tr>
                <td>${item.hg19 || "-"}</td>
                <td>${item.hg38 || "-"}</td>
                <td>${item.gene || "-"}</td>
                <td>${item.disease || "-"}</td>
                <td>${item.function || "-"}</td>
                <td>${item.drugs || "-"}</td>
                <td>${item.modification || "-"}</td>
                <td><a href="${item.doi}" target="_blank">${item.doi}</a></td>
            </tr>`;
          tableBody.innerHTML += row;
        });
      }

      function searchLiterature() {
        let inputProtein = document
          .getElementById("litProteinInput")
          .value.trim()
          .toUpperCase();
        let filteredData = literatureData.filter(
          (item) => item.gene && item.gene.toUpperCase().includes(inputProtein)
        );

        renderLiteratureTable(filteredData);
      }

      document
        .getElementById("litProteinInput")
        .addEventListener("input", searchLiterature);

      window.onload = fetchLiteratureData;

      function formatDOI(doi) {
        doi = doi.trim();
        if (doi.startsWith("http")) {
          return `<a href="${doi}" target="_blank">DOI</a>`;
        } else if (doi.startsWith("DOI:")) {
          return `<a href="https://doi.org/${doi
            .replace("DOI:", "")
            .trim()}" target="_blank">${doi}</a>`;
        } else if (doi.startsWith("PMCID:")) {
          return `<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/${doi
            .replace("PMCID:", "")
            .trim()}" target="_blank">${doi}</a>`;
        }
        return doi;
      }

      function searchPredicted() {
        let inputProtein = document
          .getElementById("predProteinInput")
          .value.trim()
          .toUpperCase();
        let detailsDiv = document.getElementById("predProteinDetails");
        detailsDiv.innerHTML = ""; // Clear previous results

        if (predictedData[inputProtein]) {
          let circRNAs = predictedData[inputProtein];

          let resultHTML = `<h4>CircRNAs binding to ${inputProtein}:</h4><ul>`;
          circRNAs.forEach((circRNA) => {
            let circATLASLink = `https://ngdc.cncb.ac.cn/circatlas/search_s1.php?circ_id=${circRNA}`;
            resultHTML += `<li><a href="${circATLASLink}" target="_blank">${circRNA}</a></li>`;
          });
          resultHTML += `</ul>`;

          detailsDiv.innerHTML = resultHTML;
          detailsDiv.style.display = "block"; // Show results
        } else {
          detailsDiv.innerHTML = "<p>No circRNAs found for this protein.</p>";
          detailsDiv.style.display = "block";
        }
      }

      window.searchPredicted = searchPredicted;

      document
        .getElementById("predProteinInput")
        .addEventListener("input", searchPredicted);