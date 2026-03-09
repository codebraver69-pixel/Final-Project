const saveToFavs=(type,content)=>{
    const favorites=JSON.parse(localStorage.getItem('favorite'))||[];
    favorites.push({
        id:Date.now(),
        type:type,
        content:content
    });
    localStorage.setItem('favorite',JSON.stringify(favorites));
    alert("Saved to favorites");
};


if (document.getElementById("currencyPage")){
    const fromselect=document.getElementById("FromCurrency");
    const toselect=document.getElementById("toCurrency");

    fetch('https://api.frankfurter.app/currencies')
    .then(response =>response.json())
    .then(data =>{
        Object.keys(data).forEach(code=>{
            fromselect.add(new Option(code,code));
            toselect.add(new Option(code,code));
        });
        fromselect.value= "USD";
        toselect.value="EUR";
    });


    document.getElementById("convertButton").addEventListener("click",function(){
        const amnt=document.getElementById("amount").value;
        const from=fromselect.value;
        const to=toselect.value;
        fetch(`https://api.frankfurter.app/latest?amount=${amnt}&from=${from}&to=${to}`)
        .then(response=>response.json())
        .then(function(data){
        const result = `${amnt} ${from}= ${data.rates[to]} ${to}`;
        document.getElementById("currencyResult").innerHTML=result;
        document.querySelector(".save-btn").style.display="block"
        })
        })
        document.getElementById("savebutton").addEventListener("click",function(){
            const resulttext=document.getElementById("currencyResult").innerHTML
            if (resulttext=== ""){
                return alert("An error occured")
            }
        })
}


if (document.getElementById("comparePage")){
    const country1=document.getElementById("country1");
    const country2=document.getElementById("country2");
    fetch("https://restcountries.com/v3.1/all?fields=name,cca3")
    .then(response1=> response1.json())
    .then(data1 =>{
        data1.sort((a,b)=>
        a.name.common.localeCompare(b.name.common)).forEach(item=>
        {
            country1.add(new Option(item.name.common,item.cca3));
            country2.add(new Option(item.name.common,item.cca3));
        }
        )
    })


    document.getElementById("comparebtn").addEventListener("click",()=>{
        fetch(`https://restcountries.com/v3.1/alpha/${country1.value}`)
        .then(r=> r.json())
        .then(d =>{
            fetch(`https://restcountries.com/v3.1/alpha/${country2.value}`)
            .then(r2=>r2.json())
            .then(d1 =>{
                const resultdiv=document.getElementById("comparisonResult");
                resultdiv.innerHTML= "";
                const makecard =(data)=>{
                    const countrydata=data[0];
                    const card=document.createElement("div");
                    card.classList.add("countrycard");
                    const flag=document.createElement("img");
                    flag.src=countrydata.flags.svg;
                    flag.width=100;
                    const name=document.createElement("h3");
                    name.innerHTML=countrydata.name.common;
                    const capital=document.createElement("P");
                    capital.innerHTML=`Capital: ${countrydata.capital}`;
                    const pop=document.createElement("p");
                    pop.innerHTML=`Population: ${countrydata.population}`;
                    const region=document.createElement("p");
                    region.innerHTML=`Region: ${countrydata.region} (${countrydata.subregion})`;
                    const lang=document.createElement("p");
                    lang.innerHTML=`Languages: ${Object.values(countrydata.languages)}`;
                    const currency=document.createElement("p");
                    currency.innerHTML=`Currency: ${Object.values(countrydata.currencies)[0].name} ${Object.values(countrydata.currencies)[0].symbol}`;
                    const time=document.createElement("p");
                    time.innerHTML=`Timezone: ${countrydata.timezones[0]}`;
                    card.append(flag,name,capital,pop,region,lang,currency,time);
                    return card;
                };
                resultdiv.appendChild(makecard(d));
                resultdiv.appendChild(makecard(d1));
                document.querySelector(".save-btn").style.display="block"
            })
        })
    })
}


const themebtn=document.getElementById("themeChange");
let dark=localStorage.getItem("theme")==="dark";
if (dark){
    document.body.classList.add("darkmode");
}


themebtn.addEventListener("click",function(){
    if (dark===false){
    document.body.classList.add("darkmode");
    localStorage.setItem("theme","dark");
    dark=true
    }else{
        document.body.classList.remove("darkmode");
        localStorage.removeItem("theme");
        dark=false
    }
})


if (document.getElementById("translatorPage")){
    document.getElementById("translatebtn").addEventListener("click",function(){
        const text=document.getElementById("sourceText").value;
        const langmerge= document.getElementById("languagemerge").value;
        if (!text) return;
        fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${langmerge}`)
        .then(response2=>response2.json())
        .then(d2=>translatetext(d2))

    })
}


function translatetext(x){
    if (x.responseData && x.responseData.translatedText){
    document.getElementById("translatedText").value=x.responseData.translatedText;
    document.querySelector(".save-btn").style.display="block";
    }else{
        console.log(x)
    }
}


const favlist=document.getElementById("favList");
if (favlist){
    const favs=JSON.parse(localStorage.getItem("favorite"))||[];
    favlist.innerHTML="";
    if (favs.length===0){
        const emptymessage=document.createElement("P");
        emptymessage.innerHTML="You haven't saved any item yet."
        favlist.appendChild(emptymessage);
    }else{
        favs.map(f=>{
            const card2=document.createElement("div");
            card2.classList.add("card");
            const label= document.createElement("P");
            const small=document.createElement("small");
            small.innerHTML=f.type.toUpperCase();
            label.appendChild(small);
            
            const textcont=document.createElement("P");
            textcont.innerHTML=f.content;

            const deletebtn=document.createElement("button");
            deletebtn.innerHTML="Delete"
            deletebtn.classList.add("deletebtn")

            deletebtn.addEventListener("click",function(){
                const update=JSON.parse(localStorage.getItem("favorite")).filter(item=> item.id !==f.id);
                localStorage.setItem("favorite",JSON.stringify(update));
                location.reload()
            });
            card2.appendChild(label);
            card2.appendChild(textcont);
            card2.appendChild(deletebtn);
            favlist.appendChild(card2)
        })
    }
}


if (document.getElementById("quizpage")){
    let score=0;
    let countries=[];
    next=document.getElementById("nextbtn")
    fetch("https://restcountries.com/v3.1/all?fields=name,flags")
    .then(res => res.json())
    .then(data=>{
        countries=data;
        startnew();
    });
    function startnew(){
        const options=document.getElementById("options");
        const flagdis=document.getElementById("flagdisplay");
        options.innerHTML="";
        flagdis.innerHTML="";
        const answer=Math.floor(Math.random()*countries.length);
        const correct=countries[answer];
        const flagimg=document.createElement("img");
        flagimg.src=correct.flags.svg;
        flagimg.style.width="250px"
        flagdis.appendChild(flagimg);

        let choices=[correct];
        while(choices.length<4){
            const random=Math.floor(Math.random()*countries.length);
            const randomcont=countries[random];
            if(!choices.includes(randomcont)){
                choices.push(randomcont);
            }
        }
        choices.sort(()=> Math.random()-0.5);
        choices.map(country =>{
            const btn=document.createElement("button");
            btn.innerHTML=country.name.common;
            btn.classList.add("quizbtn");
            btn.addEventListener("click",function(){
                if(country.name.common===correct.name.common){
                    btn.style.background="green";
                    score++;
                    document.getElementById("score").innerHTML=score;
                    next.style.display="block";
                }else{
                    btn.style.background="red";
                    next.style.display="block";
                    score--;
                    document.getElementById("score").innerHTML=score;
                }
                
            });
            
            options.appendChild(btn);
        });
    }
}

next.addEventListener("click",function(){
            this.style.display="none";
            startnew()
        })