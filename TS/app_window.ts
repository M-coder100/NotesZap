import { device } from "./app.js";
import $ from "./tquery.js"

export default class appWindow {
    constructor (options: [height: number, width: number, appName: string, appIcon: string], mainContentMarkup: string, trigger: {element: object}) {
        $(trigger).on("click", () => { 
            if ($`.appWindow`.all().length===0) { 
                let appWindow = $`div`.create();
                appWindow.setAttribute(`app-${options[2]}`, "")
                $(".appWindow_container").append(appWindow)
                $(appWindow).css.width = options[1]+"px";
                $(appWindow).css.height = options[0]+"px";
                $(appWindow).addClass("appWindow");
                $(appWindow).HTML(`
                <div class="appTopbar"><div class="appControls"><div class="app-control CLOSE"></div><div class="app-control MINIMIZE"></div><div class="app-control MAXIMIZE"></div></div><ion-icon name="${options[3]}" class="appIcon"></ion-icon><span class="appName">${options[2]}</span></div>
                <main class="application">${mainContentMarkup}</main>
            `);
            this.script();
            (function windowMovement() {
                const topBar = appWindow.children[0];
                let currentDiv: any;
                let isDown: boolean;
                $(topBar).on('mousedown', function (e: MouseEvent) {
                    isDown = true;
                    const offset = [
                        appWindow.offsetLeft - e.screenX,
                        appWindow.offsetTop - e.screenY
                    ];
                    appWindow.setAttribute('data-offset', JSON.stringify(offset));
                    currentDiv = appWindow;
                });
                $(topBar).on('touchstart', function (event: TouchEvent) {
                    isDown = true;
                    const offset = [
                        appWindow.offsetLeft - event.touches[0].screenX,
                        appWindow.offsetTop - event.touches[0].screenY
                    ];
                    appWindow.setAttribute('data-offset', JSON.stringify(offset));
                    currentDiv = appWindow;
                });
                document.addEventListener('mouseup', () => isDown = false, true);
                document.addEventListener('touchend', () => isDown = false, true);
                document.addEventListener('mousemove', (event: MouseEvent) => {
                    event.preventDefault();
                    if (isDown && currentDiv) {
                        const mousePosition = {
                            x: event.screenX,
                            y: event.screenY
                        };
                        const offset = JSON.parse(currentDiv.getAttribute('data-offset'));
                        currentDiv.style.left = (mousePosition.x + offset[0]) + 'px';
                        currentDiv.style.top  = (mousePosition.y + offset[1]) + 'px';
                    }
                }, true);
                document.addEventListener('touchmove', (event: TouchEvent) => {
                    if (isDown && currentDiv) {
                        const mousePosition = {
                            x: event.touches[0].screenX,
                            y: event.touches[0].screenY
                        };
                        const offset = JSON.parse(currentDiv.getAttribute('data-offset'));
                        currentDiv.style.left = (mousePosition.x + offset[0]) + 'px';
                        currentDiv.style.top  = (mousePosition.y + offset[1]) + 'px';
                    }
                }, { passive: true });
            })()
        
            $(".app-control.CLOSE").each((element: Element) => { $(element).on("click", () => element.parentElement?.parentElement?.parentElement?.remove()) })
            if (device == "desktop") {
                $(".app-control.MINIMIZE").each((element: Element) => {
                    $(element).on("click", () => {
                        element.parentElement?.parentElement?.parentElement?.classList.remove("full");
                    })
                })
                $(".app-control.MAXIMIZE").each((element: Element) => {
                    $(element).on("click", () => {
                        element.parentElement?.parentElement?.parentElement?.classList.add("full");
                    })
                })
            }
        }})

    }
    script(): void {}
}

const CalculatorApp = new appWindow([600, 400, "Calculator", "calculator"], ` 
    <div class="output">
        <h5 id="last-expression"><i>Calculator - Preview v1.2</i></h5>
        <input id="number-placeholder" type="number" title="Hit enter to evaluate the expression">
    </div>
    <div class="buttons">
        <div id="math_CLEAR">AC</div>
        <div>±</div>
        <div>%</div>
        <div class="math-sign">÷</div>
        <div>7</div>
        <div>8</div>
        <div>9</div>
        <div class="math-sign">×</div>
        <div>6</div>
        <div>5</div>
        <div>4</div>
        <div class="math-sign">+</div>
        <div>3</div>
        <div>2</div>
        <div>1</div>
        <div class="math-sign">-</div>
        <div id="NUM_0">0</div>
        <div>.</div>
        <div class="math-sign" id="submit">=</div>
    </div>
`, $("#trigger_calculator.app"));

CalculatorApp.script = function() {
    // calculator Logic
    let numPlaceholder = $`#number-placeholder`;
    let start = true;
    numPlaceholder.on("keydown", (e: KeyboardEvent) => {
        numPlaceholder = $`#number-placeholder`;
        (function listener({key}: KeyboardEvent){
            if (start) {
                $`[app-calculator] h5#last-expression`.element.innerHTML = "";
                start = false;
            }
            if (key == "+" || key ==  "-" || key ==  "/" || key ==  "*") {
                updateLastExpression(key);
                e.preventDefault();
            }
            if (key == "=" || key == "Enter") {
                evaluateExpression();
                e.preventDefault();
            }
        })(e);
    })
    $`[app-calculator]  #math_CLEAR`.on("click", () => {
        numPlaceholder.element.value = "";
        $`[app-calculator] h5#last-expression`.element.innerHTML = "";
    })

    
    document.querySelector("[app-calculator] div#submit")?.addEventListener("click", () => evaluateExpression())
    function evaluateExpression() {
        try {
            numPlaceholder = $`#number-placeholder`;
            const lastExpression = $`[app-calculator] h5#last-expression`.element;
        
            // checking for empty and "=" sign and adding the last and the current value to evaluate the expression
            if (numPlaceholder.value) {
                if (lastExpression.innerHTML.includes("=")) {
                    lastExpression.innerHTML = numPlaceholder.value+" =";
                    numPlaceholder.element.value = "";
                    numPlaceholder.element.focus();
                    return;
                }
                if (lastExpression.innerHTML.split(" ")[0] == "=") lastExpression.innerHTML = "";
                const evalCode = eval(lastExpression.innerHTML+numPlaceholder.value);
                lastExpression.innerHTML+=" "+numPlaceholder.value+" =";
                numPlaceholder.element.value = evalCode;   
            }
        } catch (error) {
            numPlaceholder.element.value = "0";
            $`[app-calculator] h5#last-expression`.element.innerHTML = "An error occured ="
        }
    }
    
    // When the press of "+" or "-" or "*" or "/" this code will be executed
    // this adds both the last-expression and the current-expression 
    function updateLastExpression(symbol: string) {
        numPlaceholder = $`#number-placeholder`;
        if (numPlaceholder.value) {
            const lastExpression: any = $`[app-calculator] h5#last-expression`.element;
            if (lastExpression.innerHTML.includes("=")) {
                // when the lastExpression has a `=` sign then the lastExpression will be
                // equal to numPlaceholder and remove any leading zeros from that number
                lastExpression.innerHTML = numPlaceholder.value.replace(/^0+/, '')+" "+symbol;
                numPlaceholder.element.value = "";
            } else {
                lastExpression.innerHTML = lastExpression.innerHTML+=" "+numPlaceholder.value.replace(/^0+/, '')+" "+symbol;
                numPlaceholder.element.value = "";
            }
        }
    }
}