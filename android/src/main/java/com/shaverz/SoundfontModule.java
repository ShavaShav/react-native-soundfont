package com.shaverz;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class SoundfontModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public SoundfontModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Soundfont";
    }
}
