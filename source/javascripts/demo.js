document.addEventListener("DOMContentLoaded", function() {
  CanvasCaptcha();
  var f = document.querySelector("form"),
      msg = document.createElement("p");
  f.addEventListener("submit", function(e) {
    e.preventDefault();
    msg.innerText = (document.querySelector("[name=captcha]").value === "true" ? "Passed" : "Failed") + " captcha";
    f.querySelector("fieldset").insertBefore(msg, f.querySelector("dl"));
  }, false);
}, false);
