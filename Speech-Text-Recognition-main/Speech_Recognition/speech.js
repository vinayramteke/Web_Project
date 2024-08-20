var messages = {
  start: {
    msg: "Click on the microphone icon and begin speaking.",
    class: "alert-success",
  },
  speak_now: {
    msg: "Speak now.",
    class: "alert-success",
  },
  no_speech: {
    msg: 'No speech was detected. You may need to adjust your <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a>.',
    class: "alert-danger",
  },
  no_microphone: {
    msg: 'No microphone was found. Ensure that a microphone is installed and that <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a> are configured correctly.',
    class: "alert-danger",
  },
  allow: {
    msg: 'Click the "Allow" button above to enable your microphone.',
    class: "alert-warning",
  },
  denied: {
    msg: "Permission to use microphone was denied.",
    class: "alert-danger",
  },
  blocked: {
    msg: "Permission to use microphone is blocked. To change, go to chrome://settings/content/microphone",
    class: "alert-danger",
  },
  upgrade: {
    msg: 'Web Speech API is not supported by this browser. It is only supported by <a href="//www.google.com/chrome">Chrome</a> version 25 or later on desktop and Android mobile.',
    class: "alert-danger",
  },
  stop: {
    msg: "Stop listening, click on the microphone icon to restart",
    class: "alert-success",
  },
  copy: {
    msg: "Content copy to clipboard successfully.",
    class: "alert-success",
  },
  problem: {
    msg: "There is some problem with your microphone",
    class: "alert-danger",
  },
};

let final_span = document.getElementById("final-span");
let interim_span = document.getElementById("interim-span");
let select_language = document.querySelector("#select_language");
let select_dialect = document.querySelector("#select_dialect");
let recognition;
let recognizing = false;
let final_transcript = "";
let onend_error;

document.addEventListener("DOMContentLoaded", function () {
  for (let i = 0; i < langs.length; i++) {
    select_language.options[i] = new Option(langs[i][0], i);
  }
  select_language.selectedIndex = 10;
  updatecountry();
  select_dialect.selectedIndex = 2;

  if (!("webkitSpeechRecognition" in window)) {
    showinfo("upgrade");
    return;
  } else {
    showinfo("start");
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
      recognizing = true;
      showinfo("speak_now");
      start_img.src = "images/mic-animation.gif";
      

    };

    recognition.onerror = function (event) {
      if (event.error == "not-allowed") {
        showinfo("blocked");
      } else {
        showinfo("problem");
      }
      onend_error = true;
    };
    recognition.onend = function () {
      recognizing = false;
      if (onend_error) {
        return;
      }
      start_img.src = "images/mic.gif";
      // if(start_img.src===null) start_img.src = "/Speech_Recoginition/images/mic.gif";
      
      if (!final_transcript) {
        showinfo("start");
        return;
      }
      showinfo("stop");
    };
    recognition.onresult = function (event) {
      // console.log(event);
      let interim_transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      // console.log(final_transcript);
      final_span.innerHTML = final_transcript;
      interim_span.innerHTML = interim_transcript;
    };
  }
});

function updatecountry() {
  for (let i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  let list = langs[select_language.selectedIndex];
  for (let i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? "hidden" : "visible";
}

document
  .getElementById("select_language")
  .addEventListener("change", function () {
    updatecountry();
  });
document.getElementById("start_button").addEventListener("click", function (e) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = "";
  recognition.lang = select_dialect.value;
  recognition.start();
  final_span.innerHTML = "";
  interim_span.innerHTML = "";
});
document.getElementById("copy_button").addEventListener("click", function () {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  }
  copyToClipboard(final_span.innerText);
});
function copyToClipboard(text) {
  // console.log(text);
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  showinfo("copy");
}
function showinfo(s) {
  let info = document.getElementById("info");
  if (s) {
    let message = messages[s];
    info.innerHTML = message.msg;
    info.className = "alert " + message.class;
  } else info.className = "d-none";
}

document.getElementById("speak_button").addEventListener("click", () => {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  }
  const utterance = new SpeechSynthesisUtterance(final_span.innerText);
  utterance.lang=select_dialect.value;
  speechSynthesis.speak(utterance);
});
