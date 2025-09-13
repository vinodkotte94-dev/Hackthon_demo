let currentAdvice="";
async function getAdvice(){
  const location=document.getElementById("location").value;
  const soilType=document.getElementById("soilType").value;
  const language=document.getElementById("language").value;
  const fileInput=document.getElementById("cropImage");
  const formData=new FormData();
  formData.append("location",location);
  formData.append("soilType",soilType);
  formData.append("language",language);
  if(fileInput.files.length>0) formData.append("file",fileInput.files[0]);
  const response=await fetch("http://127.0.0.1:8000/get_advice",{method:"POST",body:formData});
  const data=await response.json();
  currentAdvice=`🌱 ${data.recommendation}\n📍 ${data.location.toUpperCase()}\n🌾 ${data.crops.join(", ")}\n🧪 Soil: ${data.soil}\n➤ ${data.tips.join("\n➤ ")}\n💰 Market Prices:\n  ${data.market_prices.join("\n  ")}`;
  document.getElementById("adviceBox").innerText=currentAdvice;
}

function speakAdvice(){
  if(!currentAdvice){alert("Get advice first");return;}
  const lang=document.getElementById("language").value;
  const utter=new SpeechSynthesisUtterance(currentAdvice);
  utter.lang=lang==="hi"?"hi-IN":lang==="te"?"te-IN":"en-US";
  speechSynthesis.speak(utter);
}

function voiceInput(fieldId){
  const recognition=new (window.SpeechRecognition||window.webkitSpeechRecognition)();
  const lang=document.getElementById("language").value;
  recognition.lang=lang==="hi"?"hi-IN":lang==="te"?"te-IN":"en-US";
  recognition.start();
  recognition.onresult=function(event){
    const text=event.results[0][0].transcript.toLowerCase();
    const select=document.getElementById(fieldId);
    for(let i=0;i<select.options.length;i++){
      if(select.options[i].text.toLowerCase().includes(text)){
        select.selectedIndex=i;
        break;
      }
    }
  };
  recognition.onerror=function(e){alert("Voice error: "+e.error);}
}
