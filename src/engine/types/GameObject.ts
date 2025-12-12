import { BasicGameObject } from 'engine/classes/BasicGameObject.js';
import { ModelGameObject } from 'engine/classes/ModelGameObject.js';

export type GameObject =
    | BasicGameObject
    | ModelGameObject