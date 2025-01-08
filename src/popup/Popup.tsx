"use client";

import { useEffect, useState, useCallback } from "react";
import ColorPicker from "@rc-component/color-picker";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Slider } from "@/components/ui/slider";
import type { Color } from "@rc-component/color-picker";
import "@rc-component/color-picker/assets/index.css";
import "./popup.css";

function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="w-[42px] h-[25px] bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-pointer"
    >
      <SwitchPrimitive.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
    </SwitchPrimitive.Root>
  );
}

const Popup = () => {
  const [isValidDomain, setIsValidDomain] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isBgColorEnabled, setIsBgColorEnabled] = useState(false);
  const [isAssistantEnabled, setIsAssistantEnabled] = useState(false);
  const [assistantConfig, setAssistantConfig] = useState({
    height: 100,
    width: 800,
    color: "#666666",
  });

  // 加载保存的设置
  useEffect(() => {
    chrome.storage.sync.get(["bgColor", "isBgColorEnabled", "isAssistantEnabled", "assistantConfig"], result => {
      if (result.bgColor) setBgColor(result.bgColor);
      if (result.isBgColorEnabled !== undefined) setIsBgColorEnabled(result.isBgColorEnabled);
      if (result.isAssistantEnabled !== undefined) setIsAssistantEnabled(result.isAssistantEnabled);
      if (result.assistantConfig) setAssistantConfig(result.assistantConfig);
    });
  }, []);

  // 发送消息到 content script
  const updateAssistant = useCallback(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: "UPDATE_ASSISTANT",
          config: {
            enabled: isAssistantEnabled,
            ...assistantConfig,
          },
        });
      }
    });
  }, [isAssistantEnabled, assistantConfig]);

  const updateColors = useCallback((color: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: "UPDATE_COLORS",
          bgColor: color,
        });
      }
    });
  }, []);

  // 检查当前页面是否是微信读书
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const url = tabs[0]?.url || "";
      setIsValidDomain(url.includes("weread.qq.com"));
    });
  }, []);

  // 当配置改变时更新页面
  useEffect(() => {
    if (isValidDomain) {
      updateAssistant();
    }
  }, [isValidDomain, updateAssistant]);

  // 只在背景色改变时更新
  const handleBgColorChange = useCallback(
    (color: Color) => {
      const newColor = color.toHexString();
      setBgColor(newColor);
      chrome.storage.sync.set({ bgColor: newColor });
      if (isBgColorEnabled) {
        updateColors(newColor);
      }
    },
    [isBgColorEnabled, updateColors]
  );

  // 处理背景色开关变化
  const handleBgColorToggle = useCallback(
    (checked: boolean) => {
      setIsBgColorEnabled(checked);
      chrome.storage.sync.set({ isBgColorEnabled: checked });
      if (checked) {
        updateColors(bgColor);
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, {
              type: "UPDATE_COLORS",
              bgColor: "transparent",
            });
          }
        });
      }
    },
    [bgColor]
  );

  const resetAssistantPosition = useCallback(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: "RESET_ASSISTANT_POSITION",
        });
      }
    });
  }, []);

  if (!isValidDomain) {
    return (
      <div className="popup-container">
        <p className="error-message">请在微信读书网站使用此插件</p>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <div className="section">
        <div className="section-header">
          <div className="section-title">背景颜色</div>
          <Switch checked={isBgColorEnabled} onCheckedChange={handleBgColorToggle} />
        </div>
        {isBgColorEnabled && (
          <div className="color-picker-container">
            <ColorPicker value={bgColor} onChange={handleBgColorChange} />
          </div>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">注意力助手</div>
          <Switch
            checked={isAssistantEnabled}
            onCheckedChange={checked => {
              setIsAssistantEnabled(checked);
              chrome.storage.sync.set({ isAssistantEnabled: checked });
            }}
          />
        </div>

        {isAssistantEnabled && (
          <div className="assistant-controls">
            <div className="slider-container">
              <div className="slider-label">高度</div>
              <Slider
                value={[assistantConfig.height]}
                min={5}
                max={500}
                step={1}
                onValueChange={(value: number[]) => {
                  const newConfig = { ...assistantConfig, height: value[0] };
                  setAssistantConfig(newConfig);
                  chrome.storage.sync.set({ assistantConfig: newConfig });
                  updateAssistant();
                }}
                className="slider-root"
              />
            </div>

            <div className="slider-container">
              <div className="slider-label">宽度</div>
              <Slider
                value={[assistantConfig.width]}
                min={400}
                max={1200}
                step={10}
                onValueChange={(value: number[]) => {
                  const newConfig = { ...assistantConfig, width: value[0] };
                  setAssistantConfig(newConfig);
                  chrome.storage.sync.set({ assistantConfig: newConfig });
                  updateAssistant();
                }}
                className="slider-root"
              />
            </div>

            <div className="slider-container">
              <div className="slider-label">颜色</div>
              <div className="color-picker-container">
                <ColorPicker
                  value={assistantConfig.color}
                  onChange={(color: Color) => {
                    const newConfig = { ...assistantConfig, color: color.toHexString() };
                    setAssistantConfig(newConfig);
                    chrome.storage.sync.set({ assistantConfig: newConfig });
                    updateAssistant();
                  }}
                />
              </div>
            </div>
            <button onClick={resetAssistantPosition}>重置助手位置</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
