

    // ==UserScript==
    // @name        Empornium Slideshow
    // @description Slideshow for all images in title page.
    //              Click SLIDESHOW button at top of title page.
    //              Navigation: Left/Right arrows, Esc or click outside of modal to close slideshow.
    //              Features:
    //                - Lazy loads current and next thumbnailed full images on next/prev navigation.
    //              
    // @namespace   Empornium Scripts
    // @version     1.0.3
    // @author      vandenium
    // @grant       none
    // ---
    // @match https://*.empornium.me/torrents.php?id=*
    // ---
    // @match https://*.empornium.is/torrents.php?id=*
    // ---
    // @match https://*.empornium.sx/torrents.php?id=*
     
    // ==/UserScript==
     
    // Changelog:
    // Version 1.0.3
    //  - Don't filter out images with 'screens' and/or 'details'
    // Version 1.0.2
    //  - Fix keypress eventing issue.
    // Version 1.0.1
    //  - Fix display issue
    // Version 1.0.0
    //  - The initial version.
    // Todo:
    //  -
    //
    // ==/UserScript==
     
    const template = `
    <style>
    * {
      box-sizing: border-box;
    }
     
    #slideshow {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none;
      z-index: 100;
      top: 50%;
      
    }
     
    /* Slideshow container */
    .slideshow-container {
      max-width: 1000px;
      width: 100%;
      position: relative;
      margin: auto;
    }
     
    .slideshow-image {
      /*     min-width: 800px; */
      max-height: 800px;
    }
     
    .slides {
      display: inline-block;
    }
     
      
      .slide {
        display: block;
        width: 1024px;
        height: 768px;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 5px;
      }
     
    /* Next & previous buttons */
    .prev,
    .next {
      cursor: pointer;
      position: absolute;
      top: 50%;
      width: auto;
      margin-top: -22px;
      padding: 16px;
      color: white;
      font-weight: bold;
      font-size: 18px;
      transition: 0.6s ease;
      border-radius: 0 3px 3px 0;
      user-select: none;
    }
     
    .close {
      position: absolute;
      top: 3px;
      right: 3px;
      background-color: rgba(0, 0, 0, 0.4);
      color: white;
      border-radius: 18px;
      font-size: 19px;
      cursor: pointer;
      width: 30px;
      height: 30px;
      text-align: center;
      padding: 1px 1px;
    }
     
    .close:hover {
      background-color: rgba(0, 0, 0, 0.6);
      text-decoration: none;
      color: white;
    }
     
    .next {
      right: 0;
      border-radius: 3px 0 0 3px;
    }
     
    .prev:hover,
    .next:hover {
      background-color: rgba(0, 0, 0, 0.8);
      text-decoration: none;
    }
     
    .text {
      color: #f2f2f2;
      font-size: 15px;
      padding: 8px 12px;
      position: absolute;
      bottom: 8px;
      width: 100%;
      text-align: center;
    }
     
    .numbertext {
      color: #f2f2f2;
      font-size: 15px;
      padding: 8px 12px;
      position: absolute;
      top: 0;
      background-color: rgba(0, 0, 0, 0.4);
      border-radius: 3px;
    }
    </style>
     
    <div class="slideshow-container" id="slideshow-container"></div>
    `;
     
     
    document.querySelector("body").addEventListener("click", (e) => {
      if (e.target.localName !== "img" && e.target.innerText !== "SLIDESHOW" && e.target.className !== 'next' && e.target.className !== 'prev') {
        document.querySelector("#slideshow").style.display = "none";
      }
    });
     
    var slideIndex = 0;
     
    function showSlides(n) {
      var i;
      var slides = document.querySelectorAll(".slide");
      if (n >= slides.length) {
        slideIndex = 0;
      }
      if (n < 0) {
        slideIndex = slides.length - 1;
      }
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      
      // Lazy load full image of current and next slides
      const currentSlideImage = slides[slideIndex].lastChild;
      const nextSlideImage = slides[slideIndex + 1] && slides[slideIndex + 1].lastChild;
      
      if (currentSlideImage && currentSlideImage.srcFull) {
        currentSlideImage.onload = () => {
           currentSlideImage.style.display = 'block';
          
          currentSlideImage.parentNode.style.width = 'auto';
          currentSlideImage.parentNode.style.height = 'auto';
        }
        currentSlideImage.src = currentSlideImage.srcFull;
        
        if (nextSlideImage && nextSlideImage.srcFull) {
          
          nextSlideImage.onload = () => {
            nextSlideImage.style.display = 'block';
            nextSlideImage.parentNode.style.width = 'auto';
            nextSlideImage.parentNode.style.height = 'auto';
          }
          nextSlideImage.src = nextSlideImage.srcFull;
        }
      } else {
        currentSlideImage.parentNode.style.width = 'auto';
        currentSlideImage.parentNode.style.height = 'auto';
      }
      
      slides[slideIndex].style.display = "block";
    }
     
    const createSlideShowButton = (    ) => {
      const showSliderButton = document.createElement("a");
      showSliderButton.className = "button blueButton";
      showSliderButton.innerText = "SLIDESHOW";
     
      // Remove loading message.
      const loadingMessage = document.querySelector("#slideshow-loading-message");
      loadingMessage.remove();
     
      document
        .querySelector(".torrent_buttons .torrent_buttons")
        .appendChild(showSliderButton);
      showSliderButton.addEventListener("click", () => {
        document.querySelector("#slideshow").style.display = "inherit";
      });
    };
     
    const createSlideShowMessage = () => {
      const showSliderButton = document.createElement("span");
      showSliderButton.id = "slideshow-loading-message";
      showSliderButton.innerText = "Creating Slideshow";
      const handle = window.setInterval(() => {
        showSliderButton.innerText += ".";
      }, 500);
     
      document
        .querySelector(".torrent_buttons .torrent_buttons")
        .appendChild(showSliderButton);
      return handle;
    };
     
    const createTemplateDOM = (str) => {
      const template = document.createElement("div");
      template.id = "slideshow";
      template.innerHTML = str;
      return template;
    };
     
    const render = (target, renderPromise) => {
      const templateDOM = createTemplateDOM(template);
      const handle = createSlideShowMessage();
      
      renderPromise(templateDOM).then((updatedTemplateDOM) => {
        clearInterval(handle);
        createSlideShowButton();
     
        target.parentNode.insertBefore(updatedTemplateDOM, target.nextSibling);
     
        // Set up eventing
        const container = updatedTemplateDOM.children[1].parentNode;
        console.log(container)
        const nextButton = container.querySelector(".next");
        const previousButton = container.querySelector(".prev");
        const closeButton = container.querySelector(".close");
     
        nextButton.addEventListener("click", (e) => {
          showSlides((slideIndex += 1));
        });
     
        previousButton.addEventListener("click", (e) => {
          showSlides((slideIndex -= 1));
        });
     
        closeButton.addEventListener("click", (e) => {
          container.style.display = "none";
        });
        
        document.onkeydown = (e) => {
          if (container.style.display !== 'none') {
            if (e.keyCode === 37) {
              e.preventDefault();
              previousButton.dispatchEvent(new Event("click"));
            }
     
            if (e.keyCode === 39) {
              e.preventDefault();
              nextButton.dispatchEvent(new Event("click"));
            }
     
            if (e.keyCode === 27) {
              e.preventDefault();
              container.style.display = "none";
            }
          }
        };
     
        showSlides(slideIndex);
      });
    };
     
    const createSlide = (imgNode, n, total) => {
      const innerTemplate = `
        <div class="numbertext">${n + 1}/${total}</div>
      `;
     
      const templateParent = document.createElement("div");
      templateParent.className = "slide";
      templateParent.innerHTML = innerTemplate;
      templateParent.appendChild(imgNode);
      return templateParent;
    };
     
    const openAllHiddenImages = () =>
      new Promise((resolve, reject) => {
        window.setTimeout(() => {
          const showLinks = Array.from(document.querySelectorAll("a")).filter(
            (node) =>
              node.innerText.includes("Show") &&
              node.id !== "open_overflowquickpost"
          );
          if (showLinks.length > 0) {
            showLinks.forEach((el) => el.dispatchEvent(new Event("click")));
          }
          return resolve(showLinks);
        }, 0);
      });
     
    const renderContent = (templateDOM) =>
      new Promise((resolve, reject) => {
        openAllHiddenImages().then((links) => {
          const body = document.querySelector(".body");
     
          // Wait for all non-gif images to load.
          const allImages = Array.from(body.querySelectorAll("img"));
          let counter = 0;
     
          const nonGifImages = allImages.filter((img) => !img.src.includes(".gif"));
          const len = nonGifImages.length;
     
          nonGifImages.forEach(function (img) {
            if (img.complete) incrementCounter();
            else img.addEventListener("load", incrementCounter, false);
          });
     
          function incrementCounter() {
            counter++;
            if (counter === len) {
     
              // Non-thumbnailed images
              const images = Array.from(allImages).filter(
                (img) =>
                  (img.src.includes("fapping") ||
                    img.src.includes("jerking") ||
                    img.src.includes("freeimage")) &&
                  !img.src.includes("resize") &&
                  !img.src.includes('plot') &&
                  !img.src.includes('cast') &&
                  !img.src.includes("s7s") && // s7s section title images
                  !img.src.includes(".md.") &&
                  !img.src.includes(".th.") && // thumbs
                  !img.src.includes(".gif") && // exclude gifs for performance.
                  img.width * img.height > 30000  // exclude very small images
              );
              
              
     
              // Thumbnailed images.
              const thumbNailedImages = Array.from(allImages).filter(
                (img) => img.src.includes(".th.") || img.src.includes(".md.")
              );
              
              console.log(thumbNailedImages);
     
              const imagesLength = images.length;
              const clonedImages = [];
     
              images.forEach((img) => {
                const clonedNode = img.cloneNode(true);
                clonedNode.className += ' slideshow-image';
                clonedNode.style.width = "auto";
                clonedNode.style.height = "300";
                clonedNode.style.margin = 0;
                clonedImages.push(clonedNode);
              });
     
              const clonedThumbNailedImages = [];
              thumbNailedImages.forEach((img) => {
                const clonedNode = img.cloneNode(true);
                clonedNode.className += ' slideshow-image';
                clonedNode.style.width = "auto";
                clonedNode.style.height = "300";
                clonedNode.style.margin = 0;
                clonedNode.srcFull = clonedNode.src.replace(/\.th|\.md/g, "");
                clonedNode.style.display = 'none';
                clonedThumbNailedImages.push(clonedNode);
              });
     
              const slides = [];
              const totalImages =
                clonedImages.length + clonedThumbNailedImages.length;
     
              clonedThumbNailedImages.forEach((clonedImage, i) => {
                slides.push(createSlide(clonedImage, i, totalImages));
              });
     
              clonedImages.forEach((clonedImage, i) => {
                slides.push(createSlide(clonedImage, i, totalImages));
              });
     
              const prevLinkButton = document.createElement("a");
              prevLinkButton.className = "prev";
              prevLinkButton.innerText = "❮";
     
              const nextLinkButton = document.createElement("a");
              nextLinkButton.className = "next";
              nextLinkButton.innerText = "❯";
     
              const closeButton = document.createElement("a");
              closeButton.className = "close";
              closeButton.innerText = "✖";
     
              const container = templateDOM.children[1];
              
              container.appendChild(prevLinkButton);
     
              // append images
              slides.forEach((slide) => {
                container.appendChild(slide);
              });
     
              container.appendChild(nextLinkButton);
     
              container.appendChild(closeButton);
     
              return resolve(templateDOM);
            }
          }
        });
      });
     
    const target = document.querySelectorAll(".linkbox")[2];
    render(target, renderContent);


