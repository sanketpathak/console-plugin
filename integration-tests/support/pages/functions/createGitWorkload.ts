import { addOptions } from '../../constants/add';
import { globalPO } from '../../page-objects/global-po';
import { addPage } from '../add-page';
import { createForm } from '../app';
import { gitPage } from '../git-page';

export const createGitWorkload = (
  gitUrl: string = 'https://github.com/sclorg/nodejs-ex.git',
  componentName: string = 'nodejs-ex-git',
  resourceType: string = 'Deployment',
  appName: string = 'nodejs-ex-git-app',
  isPipelineSelected: boolean = false,
  isServerlessFunction: boolean = false,
) => {
  addPage.selectCardFromOptions(addOptions.ImportFromGit);
  gitPage.enterGitUrl(gitUrl);
  gitPage.verifyValidatedMessage(gitUrl);
  gitPage.enterComponentName(componentName);
  if (!isServerlessFunction) {
    gitPage.selectResource(resourceType);
  }
  gitPage.enterAppName(appName);
  if (isPipelineSelected === true) {
    gitPage.selectAddPipeline();
  }
  createForm.clickCreate().then(() => {
    cy.get('.co-m-loader').should('not.exist');
    cy.get('body').then(($body) => {
      if ($body.find(globalPO.errorAlert).length !== 0) {
        cy.get(globalPO.errorAlert)
          .find('.co-pre-line')
          .then(($ele) => {
            cy.log($ele.text());
          });
      } else {
        cy.log(`Workload : "${componentName}" is created`);
      }
    });
  });
};

// export const createGitWorkloadIfNotExistsOnTopologyPage = (
//   gitUrl: string = 'https://github.com/sclorg/nodejs-ex.git',
//   componentName: string = 'nodejs-ex-git',
//   resourceType: string = 'Deployment',
//   appName?: string,
//   isPipelineSelected: boolean = false,
//   isServerlessFunction: boolean = false,
// ) => {
//   navigateTo(devNavigationMenu.Topology);
//   topologyPage.waitForLoad();
//   cy.get('body').then(($body) => {
//     if ($body.find(topologyPO.emptyStateIcon).length) {
//       cy.log(`Topology doesn't have workload "${componentName}", lets create it`);
//       navigateTo(devNavigationMenu.Add);
//       createGitWorkload(
//         gitUrl,
//         componentName,
//         resourceType,
//         appName,
//         isPipelineSelected,
//         isServerlessFunction,
//       );
//       topologyPage.verifyWorkloadInTopologyPage(componentName);
//     } else {
//       topologyPage.search(componentName);
//       cy.get('body').then(($node) => {
//         if ($node.find(topologyPO.highlightNode).length) {
//           cy.log(`knative service: ${componentName} is already created`);
//         } else {
//           navigateTo(devNavigationMenu.Add);
//           createGitWorkload(
//             gitUrl,
//             componentName,
//             resourceType,
//             appName,
//             isPipelineSelected,
//             isServerlessFunction,
//           );
//           topologyPage.verifyWorkloadInTopologyPage(componentName);
//         }
//       });
//     }
//   });
// };

// export const createGitWorkloadWithResourceLimit = (
//   gitUrl: string = 'https://github.com/sclorg/nodejs-ex.git',
//   componentName: string = 'nodejs-ex-git',
//   resourceType: string = 'Deployment',
//   appName: string = 'nodejs-ex-git-app',
//   limitCPU: string = '100',
//   limitMemory: string = '100',
//   isPipelineSelected: boolean = false,
// ) => {
//   addPage.selectCardFromOptions(addOptions.ImportFromGit);
//   gitPage.enterGitUrl(gitUrl);
//   gitPage.verifyValidatedMessage(gitUrl);
//   gitPage.enterComponentName(componentName);
//   gitPage.selectResource(resourceType);
//   gitPage.enterAppName(appName);
//   cy.byLegacyTestID('import-git-form').contains('Resource limits').click();
//   cy.get(topologyPO.resourceLimits.limitCPU).clear().type(limitCPU);
//   cy.get(topologyPO.resourceLimits.limitMemory).clear().type(limitMemory);
//   if (isPipelineSelected === true) {
//     gitPage.selectAddPipeline();
//   }
//   createForm.clickCreate().then(() => {
//     cy.get('.co-m-loader').should('not.exist');
//     cy.get('body').then(($body) => {
//       if ($body.find(formPO.errorAlert).length !== 0) {
//         cy.get(formPO.errorAlert)
//           .find('.co-pre-line')
//           .then(($ele) => {
//             cy.log($ele.text());
//           });
//       } else {
//         cy.log(`Workload : "${componentName}" is created`);
//       }
//     });
//   });
// };

// export const createGitWorkloadWithBuilderImage = (
//   gitUrl: string = 'https://github.com/sclorg/nodejs-ex.git',
//   componentName: string = 'nodejs-ex-git',
//   resourceType: string = 'Deployment',
//   builderImage: string = 'nodejs',
//   appName: string = 'nodejs-ex-git-app',
//   isPipelineSelected: boolean = false,
// ) => {
//   addPage.selectCardFromOptions(addOptions.ImportFromGit);
//   gitPage.enterGitUrl(gitUrl);
//   gitPage.verifyValidatedMessage(gitUrl);
//   cy.get('.odc-import-strategy-section__edit-strategy-button').click();
//   cy.byTestID('import-strategy Builder Image').click();
//   cy.byTestID(`card ${builderImage}`).click();
//   gitPage.enterComponentName(componentName);
//   gitPage.selectResource(resourceType);
//   gitPage.enterAppName(appName);
//   if (isPipelineSelected === true) {
//     gitPage.selectAddPipeline();
//   }
//   createForm.clickCreate().then(() => {
//     cy.get('.co-m-loader').should('not.exist');
//     cy.get('body').then(($body) => {
//       if ($body.find(formPO.errorAlert).length !== 0) {
//         cy.get(formPO.errorAlert)
//           .find('.co-pre-line')
//           .then(($ele) => {
//             cy.log($ele.text());
//           });
//       } else {
//         cy.log(`Workload : "${componentName}" is created`);
//       }
//     });
//   });
// };
