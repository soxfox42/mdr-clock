{
    Graphics.prototype.setFontIBM = function() {
        return this.setFontCustom(
            atob("Px/sDjHA3+PwAAAIFgf//8AQBABB8PhmMZh8NgwAQLA4hiGIf/d4AAwHA0GR///wRAD4vjiGIYhj+HgAP5/8hiGIQ/B4AMAwCD4fjD4PAAB3v/iGIYh/93gAcD4YhiGI/+fwADDMYDAYDAYzDAA="),
            48, 8, 10
        );
    };

    const backgroundImage = require("heatshrink").decompress(atob("2GwgJC/ACU//+ACiMH/UL/gVRnOEgkzFiPGhEChlgCh8DhEQgMCjAGB/4AR/0AgQrNiFAkEAwFBCp8gCodAwECvwLC8AVICAIVCDQMCmYLCOhKUFkAVNgJdGCoM87l2sZCHSoMEikJ+SdBgU+g1m5lmmAVGgQVBi0b3eIZIMznwVBs/wCpMVlcapAVCswrCK44VCinLjU4Cp8D+fkK4QVGK46DIv07s18+aDICo4EChjxJYo4EC5gVJeI4KCvAVJCAIVCDQIVDABUQCodBgED/4AR/wpNAAMDhEQgMCjAVPgHGYIMMsAVQnOEgkzTwoALg/6hf8CiAABn//FSIAyYiQACFf4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4AR/4AUFf4AXgY1I/k/BRHAgQfIgkgBRFACongsAVHh0fCpEB2HgCo8bmOACo8DjIVImOBCpMYIJExwZBIgdYCpE1wwVUxgVJIJWYCqmwTJQVITJUA8P4YpE/CpLxQgf/AA/8n4KI4AfIAERBVNpQVD+BtFCpc4C4IVRn0zz4VSnk/yffCqM5n4sBCqMzn1/n4VRmEc/1/QaU5/iZTmf5CqmTNqU+iEXCqTxKgYKCAAv8CoYAF4AqIAHMBIgPA4fn+/xJYQKBgPH4/3+fnOQUDsEB4PGm0GgYgCBQMDsdmgc2mcwBQMGmED4YVCgwJB4AKBg0zm0Di0ziAVCm0w4AVHmwnBCoNGmdACoWzsBXCAAPgBQdm2c38fD+ZiCg2x4ArBmEwGIIKD42zmApBFYkxCpMx4xpBmcAAIIVLK4IVGNoSMBK4JtBAAIVCBQIABswVBsY2CgIfB+fz8YABNoQKBmPHPAOD47FCAFQ="));

    const percentBuffer = Graphics.createArrayBuffer(78, 12, 1);
    const barBuffer = Graphics.createArrayBuffer(78, 12, 1);

    const drawNumbers = function() {
        g.setBgColor(0, 0, 0);
        g.clearRect({ x: 4, y: 44, w: 168, h: 74 });
        g.setFont("IBM").setColor(0, 255, 255);
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 11; x++) {
                if (x > 0 && x < 10 && y > 0 && y < 4) continue;
                g.drawString(Math.randInt(10), 4 + x * 16 , 44 + y * 16);
            }
        }

        drawTime();
    };

    const drawTime = function() {
        g.setFont("IBM:3").setColor(0, 255, 255);

        const now = new Date();
        const digits = [
            Math.floor(now.getHours() / 10),
            now.getHours() % 10,
            Math.floor(now.getMinutes() / 10),
            now.getMinutes() % 10,
        ];

        for (let i = 0; i < 4; i++) {
            g.drawString(digits[i], 25 + i * 35, 66);
        }
    };

    const drawBattery = function() {
        const level = E.getBattery();

        g.setBgColor(0, 0, 0);
        g.clearRect({ x: 7, y: 148, w: 77, h: 11 });

        // Font uses colon as percent
        percentBuffer.clear().setFont("IBM");
        percentBuffer.drawString(`${level}:`, 1, 1);

        const barWidth = Math.round(78 * level / 100);
        barBuffer.clear().fillRect({x: 0, y: 0, w: barWidth, h: 12});

        g.drawImages([
            { x: 7, y: 148, image: barBuffer },
            { x: 7, y: 148, image: percentBuffer, compose: "xor" },
        ]);
    };

    const redraw = function() {
        drawNumbers();
        drawBattery();
    };

    g.reset();
    g.setBgColor(0, 0, 0).clear();
    g.setColor(0, 255, 255).drawImage(backgroundImage, 0, 0);

    let tickTimeout;
    const tickHandler = function() {
        tickTimeout = setTimeout(tickHandler, 60000 - Date.now() % 60000);
        redraw();
    };

    tickHandler();

    Bangle.loadWidgets();
    require("widget_utils").swipeOn();

    Bangle.setUI({
        mode: "clock",
        remove() {
            require("widget_utils").show();
            clearTimeout(tickTimeout);
            delete Graphics.prototype.setFontIBM;
        },
    });
}
