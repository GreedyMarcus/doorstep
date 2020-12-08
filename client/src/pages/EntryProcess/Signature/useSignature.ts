import { useState, useEffect, FormEvent } from 'react'
import { useAppDispatch } from '../../../store'
import { useTranslation } from 'react-i18next'
import { addNotification } from '../../../store/action'
import { fabric } from 'fabric'

interface SignatureHookProps {
  signatureCanvasId: string
  signatureCanvasContainerId: string
  visible: boolean
  onNextClick: (signature: string) => void
}

/**
 * Custom React hook that spearates the Signature component logic.
 */
const useSignature = ({ signatureCanvasId, signatureCanvasContainerId, visible, onNextClick }: SignatureHookProps) => {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [canvas, setCanvas] = useState(null as fabric.Canvas | null)
  const [canvasContainer, setCanvasContainer] = useState(null as HTMLElement | null)

  useEffect(() => {
    if (visible && canvas) {
      canvas.setDimensions({
        width: canvasContainer ? canvasContainer.getBoundingClientRect().width - 65 : 0,
        height: 300
      })
    }
  }, [visible, canvasContainer?.getBoundingClientRect().width])

  useEffect(() => {
    setCanvasContainer(document.getElementById(signatureCanvasContainerId))

    const signatureCanvas = new fabric.Canvas(signatureCanvasId, {
      width: canvasContainer ? canvasContainer.getBoundingClientRect().width - 65 : 0,
      height: 300,
      isDrawingMode: true
    })

    signatureCanvas.freeDrawingBrush.width = 4

    setCanvas(signatureCanvas)
  }, [])

  /**
   * Removes the signature from the canvas.
   */
  const handleSignatureClear = () => canvas?.clear()

  /**
   * Checks if signature is provided.
   */
  const isSignatureProvided = (): boolean => {
    if (canvas) {
      return canvas
        .getContext()
        .getImageData(0, 0, canvas.width ?? 0, canvas.height ?? 0)
        .data.some(channel => channel !== 0)
    }
    return false
  }

  /**
   * Handles the next click request.
   */
  const handleNextClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isSignatureProvided() || !canvas) {
      dispatch(addNotification({ type: 'warning', message: t('notification.provideSignature.warning') }))
      return
    }

    onNextClick(canvas.toJSON())
    // signatureCanvas.loadFromJSON(
    //   '{"objects":[{"type":"rect","left":50,"top":50,"width":20,"height":20,"fill":"green","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,"hasControls":true,"hasBorders":true,"hasRotatingPoint":false,"transparentCorners":true,"perPixelTargetFind":false,"rx":0,"ry":0},{"type":"circle","left":100,"top":100,"width":100,"height":100,"fill":"red","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,"hasControls":true,"hasBorders":true,"hasRotatingPoint":false,"transparentCorners":true,"perPixelTargetFind":false,"radius":50}],"background":"rgba(0, 0, 0, 0)"}',
    //   signatureCanvas.renderAll.bind(signatureCanvas)
    // )
  }

  return [handleSignatureClear, handleNextClick] as const
}

export default useSignature
