function loadVideo(element) {
  const src = element.getAttribute('data-src');
  const iframe = document.createElement('iframe');

  iframe.setAttribute('src', src);
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('allowfullscreen', 'true');
  iframe.setAttribute('mozallowfullscreen', 'true');
  iframe.setAttribute('webkitAllowFullScreen', 'true');
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.position = "absolute";
  iframe.style.top = "0";
  iframe.style.left = "0";

  const parent = element.parentElement;
  parent.innerHTML = '';
  parent.appendChild(iframe);
}