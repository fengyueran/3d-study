import * as chapter1 from './01-three-basic';
import * as chapter2 from './02-geometry';
import * as chapter3 from './03-modal-obj';
import * as chapter4 from './04-hierarchy-model';
import * as chapter5 from './05-texture';

export const lessons = {
  '1-04': chapter1.FirstScene,
  '1-08': chapter1.Light,
  '1-12': chapter1.SizeChange,
  '1-13': chapter1.Stats,
  '1-14': chapter1.PerspectiveCamera,
  '1-15': chapter1.CommonShape,
  '1-16': chapter1.MeshPhongMaterial,
  '1-17': chapter1.RendererSetting,
  '1-18': chapter1.Gui,

  '2-01': chapter2.Vertex,
  '2-04': chapter2.Plane,
  '2-06': chapter2.PlaneNormal,
  '2-08': chapter2.Transform,

  '3-03': chapter3.Material,

  '4-01': chapter4.Group,
  '4-03': chapter4.LocalWorldCoordinate,
  '4-05': chapter4.GroupRemove,

  '5-01': chapter5.CreateTexture,
};
