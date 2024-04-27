import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

interface GameState {
  resources: AllResources,
  buildings: AllBuildings
}

interface Resource {
  name: string,
  amount: number;
  increment: number,
  manual: number,
  cap: number,
}

const DEFAULT_RESOURCE: Resource ={
    name: "",
    amount: 0,
    increment: 0,
    manual: 0,
    cap: 0,
}

export interface AllResources {
  wood: Resource
  stone: Resource
  knowledge: Resource
  coins: Resource
}

interface BuildingCost{
  resource: keyof AllResources,
  amount:number,
  costCreep:number
}

interface Building {
  name:string,
  amount:number,
  cost:BuildingCost[]
}

export interface AllBuildings {
  storage:Building
  school:Building
}


interface ResourceActions {
  increment: (resource: keyof AllResources, amount: number) => void;
  incrementAllResourcesTick: (dt: number) => void;
  getResource: (resource: keyof AllResources) => Resource;
  clearAll: () => void;
  updateResources: () => void
}

interface BuildingActions {
  buy: (building: keyof AllBuildings) => void
  getBuilding: (building: keyof AllBuildings) => Building
}

const INITIAL_RESOURCE: GameState = {
  resources: {
    wood: {
      ...DEFAULT_RESOURCE,
      name: "Wood",
      increment: 1,
      manual: 1,
      cap: 60
    },
    stone: {
      ...DEFAULT_RESOURCE,
      name: "Stone",
      increment: 2,
      manual: 1,
      cap:60
    },
    knowledge: {
      ...DEFAULT_RESOURCE,
      name: "Knowledge",
      manual: 1
    },
    coins: {
      ...DEFAULT_RESOURCE,
      name: "Coins",
      cap: 250
    },
  },
  buildings:{
    storage: {
      name:"Storage",
      amount:0,
      cost:[
        {resource:"wood", amount:15, costCreep:1.4},
        {resource:"stone", amount:15, costCreep:1.4},
      ]
    },
    school: {
      name:"School",
      amount:0,
      cost:[
        {resource:"wood", amount:25, costCreep:1.4},
      ]
    },
  }
}

const useResourceBase = create<GameState & ResourceActions & BuildingActions>()(
  persist(
    (set, get) => ({
      resources: INITIAL_RESOURCE.resources,
      buildings: INITIAL_RESOURCE.buildings,
      getResource: (resource) => {
        const resources = get().resources
        const r = resources[resource]
        return r
      },
      getBuilding: (building) => {
        const buildings = get().buildings
        const r = buildings[building]
        return r
      },

      increment: (resource, amount) => {
        const r = get().getResource(resource as keyof AllResources)
        const newR = { ...r, amount: Math.min(r.cap, r.amount + amount) }

        set(state => (
          {
            resources: {
              ...state.resources,
              [resource as keyof typeof state.resources]: newR
            }
          }
        ))
      },
      updateResources: () => {
        const newResources = get().resources
        const buildings = get().buildings
        
        newResources.wood.cap = INITIAL_RESOURCE.resources.wood.cap + buildings.storage.amount*150
        
        newResources.stone.cap = INITIAL_RESOURCE.resources.stone.cap + buildings.storage.amount*120

        newResources.knowledge.increment = INITIAL_RESOURCE.resources.knowledge.increment+ buildings.school.amount*1
        newResources.knowledge.cap = INITIAL_RESOURCE.resources.knowledge.cap + buildings.school.amount*500
        
        buildings.storage.cost = buildings.storage.cost.map((r,idx) => ({...r, costCreep: INITIAL_RESOURCE.buildings.storage.cost[idx].costCreep-buildings.school.amount/100 }))

        set(state => (
          { resources: { ...newResources },
            buildings: {...buildings} 
          }
        ))
      },
      incrementAllResourcesTick: (dt) => {
        const newResources = get().resources
        for (var key in newResources) {
          if (newResources.hasOwnProperty(key)) {
            const old = newResources[key as keyof typeof newResources]
            newResources[key as keyof typeof newResources] = {
              ...old,
              amount: Math.min(old.cap, old.amount + dt * old.increment)
            }
          }
        }
        console.log(newResources)
        set(state => (
          { resources: { ...newResources } }
        ))
      },
      buy: (building) => {
        const b = get().getBuilding(building)
        const allRes = get().resources
        const inc = get().increment

        const hasEnough = b.cost.filter((r) => r.amount*r.costCreep**b.amount <= allRes[r.resource].amount).length === b.cost.length
        if(!hasEnough)
          return
        b.cost.forEach((r) => inc(r.resource, -r.amount*r.costCreep**b.amount))
        
        const newR = { ...b, amount: b.amount + 1 }

        set(state => (
          {
            buildings: {
              ...state.buildings,
              [building]: newR
            }
          }
        ))
      },
      clearAll: () => {
        set(state => (
          INITIAL_RESOURCE
        ))
      }
    }),

    {
      name: "resource-storage",
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    }
  ),
);

export default useResourceBase;
