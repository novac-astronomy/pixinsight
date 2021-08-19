import { FrameStyle_Box, TextAlign_VertCenter } from "@pixinsight/core";
import { useDialog } from "@pixinsight/react";
import {
  UIControl,
  UIGroupBox,
  UIHorizontalSizer,
  UILabel,
  UIPushButton,
  UISpinBox,
  UIStretch,
  UIToolButton,
  UIVerticalSizer,
  UIViewList,
} from "@pixinsight/ui";
import React, { useEffect, useMemo, useState } from "react";
import { version } from "../package.json";
import { binarize } from "./process/binarize";

export const SCRIPT_NAME = "Pixinsight Template";
export const SCRIPT_VERSION = version;
const SCRIPT_DESCRIPTION = `<b> ${SCRIPT_NAME}  v${version}</b> &mdash; This script serves as a template for creating your own scripts.<br><br>Copyright (c) 2021 GV`;

export const defaultParameters = {
  testParameter: 9
};

type Parameters = typeof defaultParameters;

export function ScriptDialog({
  parameters: storedParameters,
  onParameterChange,
}: {
  parameters?: Partial<Parameters>;
  onParameterChange?: <K extends keyof Parameters>(
    name: K,
    value: Parameters[K]
  ) => void;
}) {
  const [parameters, setParameters] = useState({
    ...defaultParameters,
    ...storedParameters,
  });

  const dialog = useDialog();

  function process(image: Image) {
    const result = new Image();

    console.log("Binarize...");
    const finalImage = binarize(result, {
      threshold: parameters.testParameter,
    });

    return {
      finalImage,
    };
  }

  function onApplyClick() {

    const targetImage = new Image();
    try {
      const { finalImage } = process(targetImage);

      const msg = new MessageBox(
          "Success"
      );
      msg.execute();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <UIVerticalSizer>
      <UIHorizontalSizer>
        <UIVerticalSizer margin={5} spacing={5}>
          <UILabel
            text={SCRIPT_DESCRIPTION}
            frameStyle={FrameStyle_Box}
            minHeight={70}
            maxHeight={70}
            wordWrapping={true}
            useRichText={true}
            stretchFactor={0}
          />


          <UIGroupBox title="Test Group" spacing={5} margin={5}>
            <UIHorizontalSizer spacing={5}>
              <UILabel text="Size: " textAlignment={TextAlign_VertCenter} />
              <UISpinBox
                minValue={3}
                maxValue={61}
                stepSize={2}
                value={parameters.testParameter}
              />
            </UIHorizontalSizer>
          </UIGroupBox>

          <UIPushButton
              onClick={onApplyClick}
              icon=":/icons/ok.png"
              text="Apply"
          />
        </UIVerticalSizer>
      </UIHorizontalSizer>
    </UIVerticalSizer>
  );
}
