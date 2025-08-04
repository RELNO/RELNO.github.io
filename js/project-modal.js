/**
 * Project Modal functionality - shared across pages
 * Handles project modal display, URL hash management, and navigation
 */

(function () {
  "use strict";

  /**
   * Generates an HTML template for a project based on the provided JSON file.
   * @param {string} jsonPath - The path to the JSON file containing project details.
   * @returns {Promise<string|null>} - A promise that resolves to the HTML template or null if an error occurs.
   */
  async function generateProjectHtmlTemplate(jsonPath) {
    try {
      // Fetch JSON data
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error("Failed to fetch JSON data");
      }
      const project = await response.json();

      // Validate required data properties
      if (
        !project.title ||
        !project.subtitle ||
        !project.text ||
        !project.carouselItems
      ) {
        throw new Error("Invalid project data");
      }

      // Generate HTML template
      let html = `
    <div class="row">
      <div class="col-sm"><h2>${project.title}</h2></div>
    </div>
    <h5>${project.subtitle}</h5>
    </div>
    <div class="col-sm">
      ${project.badges
        ?.map(
          (badge) => `
          <a class="badge rounded-pill text-dark bg-white border border-1 border shadow" href="${badge.link}" target="_blank">${badge.label}</a>
          `
        )
        .join("")}
    </div>

    <div class="mt-4 mb-4">
    ${project.text}
    </div>
    <div id="carouselExample" class="carousel slide">
      <div class="carousel-inner">
  `;

      // Generate carousel items
      if (Array.isArray(project.carouselItems)) {
        project.carouselItems.forEach((item, index) => {
          if (item.type === "iframe" && item.src) {
            html += `
          <div class="carousel-item${index === 0 ? " active" : ""}">
            <iframe width="100%" height="500" src="${
              item.src
            }" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          </div>
        `;
          } else if (item.type === "image" && item.src) {
            html += `
          <div class="carousel-item${index === 0 ? " active" : ""}">
            <img src="${item.src}" class="d-block w-100" alt="..." />
          </div>
        `;
          }
        });
      }

      if (project.carouselItems.length > 1) {
        // Generate carousel control indicators
        html += `
        <ol class="carousel-indicators">
          ${project.carouselItems
            .map(
              (item, index) => `
              <li data-bs-target="#carouselExample" data-bs-slide-to="${index}"${
                index === 0 ? ' class="active"' : ""
              }></li>
            `
            )
            .join("")}
        </ol>
      `;
        // Generate carousel controls
        html += `
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>
    `;
      }

      return html;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Opens the project modal with the content of the given project name.
   * @param {string} projectName - The name of the project to load.
   */
  function openProjectModal(projectName) {
    // Determine the correct path based on current location
    const isInProjectsFolder = window.location.pathname.includes("/projects/");
    const basePath = isInProjectsFolder ? "" : "projects/";
    const pathPrj = `${basePath}${projectName}/${projectName}.json`;

    generateProjectHtmlTemplate(pathPrj)
      .then((htmlTemplate) => {
        if (htmlTemplate) {
          // Use jQuery if available, otherwise use vanilla JS
          if (window.$ && $(".modal-body").length) {
            $(".modal-body").html(htmlTemplate);
          } else {
            const modalBody = document.querySelector(".modal-body");
            if (modalBody) {
              modalBody.innerHTML = htmlTemplate;
            }
          }

          const myModalEl = document.querySelector(".portfolio-modal");
          if (myModalEl && window.bootstrap) {
            const modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
            modal.show();
          }
        } else {
          // If project not found, clear the hash
          history.replaceState(null, null, window.location.pathname);
        }
      })
      .catch((error) => {
        console.error(error);
        // If there's an error, clear the hash
        history.replaceState(null, null, window.location.pathname);
      });
  }

  /**
   * Handles the logic for showing a project based on the URL hash.
   */
  function handleHashChange() {
    const projectName = window.location.hash.substring(1);
    if (projectName) {
      openProjectModal(projectName);
    } else {
      const myModalEl = document.querySelector(".portfolio-modal");
      if (myModalEl && window.bootstrap) {
        const modal = bootstrap.Modal.getInstance(myModalEl);
        if (modal) {
          modal.hide();
        }
      }
    }
  }

  /**
   * Opens a PDF modal with the given URL and title.
   * @param {string} pdfUrl - The URL of the PDF to display.
   * @param {string} title - The title to display in the modal header.
   */
  function openPdfModal(pdfUrl, title) {
    // Ensure PDF modal HTML exists
    if (!document.querySelector(".pdf-modal")) {
      const pdfModalHTML = `
        <!-- PDF Modal -->
        <div
          class="pdf-modal modal fade"
          id="PdfModal"
          tabindex="-1"
          aria-labelledby="PdfModal"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header border-0 d-flex justify-content-between align-items-center">
                <h5 class="modal-title"></h5>
                <div class="d-flex gap-2">
                  <a class="btn btn-sm btn-outline-primary download-link" target="_blank">
                    <i class="fas fa-download"></i> Download
                  </a>
                  <button
                    class="btn-close"
                    type="button"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
              </div>
              <div class="modal-body p-0 position-relative">
                <div class="pdf-loading text-center p-4" style="display: none;">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2">Loading PDF...</p>
                </div>
                <iframe class="pdf-viewer" style="width: 100%; height: 80vh; border: none;"></iframe>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", pdfModalHTML);
    }

    // Set the PDF content
    const modal = document.querySelector(".pdf-modal");
    const modalTitle = modal.querySelector(".modal-title");
    const iframe = modal.querySelector(".pdf-viewer");
    const downloadLink = modal.querySelector(".download-link");
    const loadingDiv = modal.querySelector(".pdf-loading");

    modalTitle.textContent = title;
    downloadLink.href = pdfUrl;

    // Show loading indicator
    loadingDiv.style.display = "block";
    iframe.style.display = "none";

    // Check if it's an external URL (GitHub, etc.) vs local PDF
    if (
      pdfUrl.includes("github.com") ||
      (pdfUrl.startsWith("http") && !pdfUrl.includes(window.location.hostname))
    ) {
      // Use Google Docs viewer for external PDFs
      iframe.src = `https://docs.google.com/gview?url=${encodeURIComponent(
        pdfUrl
      )}&embedded=true`;

      // Add load event to hide loading spinner
      iframe.onload = function () {
        loadingDiv.style.display = "none";
        iframe.style.display = "block";
      };

      // Add error handling - if Google Docs fails, fall back to direct embedding
      iframe.onerror = function () {
        console.log("Google Docs viewer failed, trying direct embedding...");
        iframe.src = pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0";
      };

      // Set a timeout to check if the iframe loaded properly
      setTimeout(() => {
        // Always hide loading after timeout
        loadingDiv.style.display = "none";
        iframe.style.display = "block";
      }, 3000);
    } else {
      // For local PDFs, embed directly without Google Docs viewer
      iframe.src = pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0";
      iframe.onload = function () {
        loadingDiv.style.display = "none";
        iframe.style.display = "block";
      };

      // Shorter timeout for local files
      setTimeout(() => {
        loadingDiv.style.display = "none";
        iframe.style.display = "block";
      }, 1000);
    }

    // Show the modal
    if (window.bootstrap) {
      const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modal);
      bootstrapModal.show();
    }
  }

  /**
   * Handles click events for PDF links.
   * @param {Event} event - The click event.
   */
  function handlePdfLinkClick(event) {
    const link = event.target.closest("a[data-pdf-modal]");
    if (link) {
      event.preventDefault();
      const pdfUrl = link.href;
      const title = link.getAttribute("data-pdf-title") || "Document";
      openPdfModal(pdfUrl, title);
    }
  }

  /**
   * Initializes the project modal system
   */
  function initProjectModal() {
    // Ensure modal HTML exists in the page
    if (!document.querySelector(".portfolio-modal")) {
      const modalHTML = `
        <!-- Project Modal -->
        <div
          class="portfolio-modal modal fade"
          id="PortfolioModal"
          tabindex="-1"
          aria-labelledby="PortfolioModal"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header border-0">
                <button
                  class="btn-close"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body pb-5"></div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHTML);
    }

    // Set up event listeners
    document.addEventListener("click", function (event) {
      // Handle PDF links first
      handlePdfLinkClick(event);

      // Handle project buttons
      const button = event.target.closest("button");
      if (button && button.name) {
        // Update the URL hash to trigger the modal
        window.location.hash = button.name;
      }
    });

    // Clear the hash when the modal is closed
    document.addEventListener("hidden.bs.modal", function (event) {
      if (event.target.classList.contains("portfolio-modal")) {
        const modalBody = event.target.querySelector(".modal-body");
        if (modalBody) {
          modalBody.innerHTML = "";
        }
        if (window.location.hash) {
          history.replaceState(null, null, window.location.pathname);
        }
      }
    });

    // Handle hash change for back/forward navigation
    window.addEventListener("hashchange", handleHashChange, false);

    // Handle hash change on page load
    handleHashChange();
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectModal);
  } else {
    initProjectModal();
  }

  // Make functions available globally if needed
  window.ProjectModal = {
    openProjectModal: openProjectModal,
    handleHashChange: handleHashChange,
    openPdfModal: openPdfModal,
  };
})();
