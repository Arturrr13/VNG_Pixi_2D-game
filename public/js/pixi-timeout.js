/**
 * pixi-timeout is a plugin which replicates the behaviour of window.setTimout
 * but uses PIXI.Ticker (requestAnimationFrame) as the method of progressing time
 * The bonus is that any timeouts will be paused and resumed automatically when
 * you call PIXI.Application.stop & PIXI.Application.start
 */
(function init(pixi)
{
    if (!pixi)
    {
        throw new Error("PIXI was not found")
    }

    if (!pixi.Ticker || !pixi.Ticker.shared)
    {
        throw new Error("PIXI.Ticker was not found")
    }

    /**
     * Sets a timeout.
     *
     * @param  {number}    secs  The seconds
     * @param  {Function}  cb    Callback function to fire after timeout
     * @return {object}    Timer state object
     */
    function setTimeout(secs, cb)
    {
        let progress = 0;
        const id = Math.random();

        const Ticker = ((delta) =>
        {
            progress += delta;

            const elapsed = progress / (60 * pixi.Ticker.shared.speed);

            if (elapsed > secs) end(true);
        });

        const end = (fire) =>
        {
            pixi.Ticker.shared.remove(Ticker);
            tickerList = tickerList.filter(function( obj ) {
                return obj.id !== id;
            });

            if (fire) cb();
        }

        const clear = () =>
        {
            end(false)
        };

        const finish = () =>
        {
            end(true);
        };

        // start
        pixi.Ticker.shared.add(Ticker);

        const ticker = { clear, finish, id };

        tickerList.push(ticker);

        return ticker;
    }

    /**
     * Clears a timeout, preventing the function from being fired
     *
     * @param  {object}  timerObj  A timer state object
     */
    function clearTimeout(timerObj)
    {
        timerObj.clear()
    }
    function clearAllTimeouts()
    {
        tickerList.forEach(timeout=>{
            clearTimeout(timeout)
        })
    }

    pixi.setTimeout = setTimeout
    pixi.clearTimeout = clearTimeout
    pixi.clearAllTimeouts = clearAllTimeouts
    let tickerList = [];
// eslint-disable-next-line
}(PIXI));