/**
 * Seed two WP articles into Payload Resources collection.
 *
 * 1. Downloads featured images from WP
 * 2. Uploads them to Payload Media (→ R2)
 * 3. Creates Resources with Lexical rich text content
 * 4. Publishes them so they appear on /resources
 *
 * Usage: npx tsx scripts/seed-articles.ts
 */

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import https from 'https'
import http from 'http'

// Load .env.local BEFORE importing Payload config
const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

// --- Lexical node builders ---

function textNode(text: string, format: number = 0): any {
  return { type: 'text', version: 1, text, format, detail: 0, mode: 'normal', style: '' }
}

function boldText(text: string): any {
  return textNode(text, 1) // 1 = bold
}

function italicText(text: string): any {
  return textNode(text, 2) // 2 = italic
}

function linkNode(text: string, url: string): any {
  return {
    type: 'link',
    version: 3,
    fields: { url, newTab: true, linkType: 'custom' },
    children: [textNode(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    rel: 'noopener noreferrer',
  }
}

function heading(tag: 'h2' | 'h3', children: any[]): any {
  return { type: 'heading', version: 1, tag, children, direction: 'ltr', format: '', indent: 0 }
}

function paragraph(children: any[]): any {
  return { type: 'paragraph', version: 1, children, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '' }
}

function listItem(children: any[]): any {
  return { type: 'listitem', version: 1, children, direction: 'ltr', format: '', indent: 0, value: 1 }
}

function bulletList(items: any[][]): any {
  return {
    type: 'list',
    version: 1,
    listType: 'bullet',
    tag: 'ul',
    start: 1,
    children: items.map((itemChildren) => listItem(itemChildren)),
    direction: 'ltr',
    format: '',
    indent: 0,
  }
}

function orderedList(items: any[][]): any {
  return {
    type: 'list',
    version: 1,
    listType: 'number',
    tag: 'ol',
    start: 1,
    children: items.map((itemChildren) => listItem(itemChildren)),
    direction: 'ltr',
    format: '',
    indent: 0,
  }
}

function codeBlock(code: string, language: string = 'bash'): any {
  return {
    type: 'block',
    version: 2,
    fields: {
      blockType: 'code',
      code,
      language,
    },
    format: '',
  }
}

function lexicalRoot(children: any[]): any {
  return {
    root: {
      type: 'root',
      version: 1,
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
    },
  }
}

// --- Download helper ---

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const request = (targetUrl: string) => {
      mod.get(targetUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          request(res.headers.location!)
          return
        }
        const chunks: Buffer[] = []
        res.on('data', (chunk: Buffer) => chunks.push(chunk))
        res.on('end', () => {
          writeFileSync(dest, Buffer.concat(chunks))
          resolve()
        })
        res.on('error', reject)
      }).on('error', reject)
    }
    request(url)
  })
}

// --- Article 1: Multi-Architecture ---

function buildMultiArchContent(): any {
  return lexicalRoot([
    paragraph([
      boldText('Multi-architecture is no longer a theoretical advantage'),
      textNode('— it is an operational reality and a real strategic advantage for engineering teams who want cost efficiency, deployment flexibility, and long-term resilience.'),
    ]),
    paragraph([
      textNode('In Part 1, we explored the why—from reducing compute costs and infrastructure lock-in to the possible opportunities in increased agility and optimized workloads across diverse environments. Missed it? '),
      linkNode('Read Part 1: Multi-Architecture as a Strategic Enabler', 'https://caepe.sh/multi-architecture-arm-x64-at-scale/'),
      textNode('.'),
    ]),
    paragraph([
      textNode('Now '),
      boldText('in Part 2, we focus on the how'),
      textNode(':'),
    ]),
    bulletList([
      [textNode('Tooling and delivery workflows')],
      [textNode('Real-world deployment and pipeline design')],
      [textNode('Security and compliance integration')],
    ]),

    // --- Why Multi-Architecture Delivery Matters in 2025 ---
    heading('h2', [textNode('Why Multi-Architecture Delivery Matters in 2025')]),
    paragraph([
      textNode('With ARM64 and X86_64(amd64) now coexisting across environments, multi-architecture delivery lets teams build once and deploy consistently, without duplicating pipelines or adding overhead.'),
    ]),

    // --- Portability, Flexibility & Resilience ---
    heading('h2', [textNode('Portability, Flexibility & Resilience: Real-World Wins')]),
    paragraph([
      textNode("Multi-architecture isn't just about supporting ARM and x86_64—it's about building smarter systems with fewer trade-offs:"),
    ]),
    bulletList([
      [boldText('Avoid lock-in:'), textNode(' Keep workloads portable across chipsets and cloud vendors.')],
      [boldText('Deploy anywhere:'), textNode(' Run the same container on cloud, edge, or on-prem.')],
      [boldText('Roll out with context:'), textNode(' Route deployments based on performance, cost, or node capacity.')],
      [boldText('Stay resilient:'), textNode(' Handle provisioning delays or outages by shifting architectures.')],
      [boldText('Reduce rework:'), textNode(' Reuse delivery pipelines across environments—no big refactors needed.')],
    ]),
    paragraph([
      textNode('For platform teams, it is about having options. You run the right workload on the right infrastructure—without reinventing your pipeline every time.'),
    ]),

    // --- But Historically… It Was a Headache ---
    heading('h2', [textNode('But Historically… It Was a Headache')]),
    paragraph([
      textNode('Until recently, supporting ARM and x64 in the same pipeline meant slow builds and complex deployments:'),
    ]),
    bulletList([
      [textNode('Duplicate builds or brittle scripts')],
      [textNode('Cross-compilation issues and slow emulation')],
      [textNode('Architecture-specific base image maintenance')],
      [textNode('Debugging blind spots across platforms')],
    ]),
    paragraph([
      textNode('The difficult implementation kept multi-architecture in the theoretical realm and made it a "nice to have." Today, that has changed.'),
    ]),

    // --- Modern Tooling is a Gamechanger ---
    heading('h2', [textNode('Modern Tooling is a Gamechanger')]),
    paragraph([
      textNode("Multi-architecture is now viable for any modern platform team—not just elite infrastructure groups. With the right tools, it is now easy to adopt."),
    ]),
    paragraph([
      textNode('Docker Build Cloud offers fast, cloud-native builders that support native ARM64 and x86_64 (amd64) builds—no emulation or per-architecture scripting required.'),
    ]),
    paragraph([
      textNode('Instead of using slow QEMU-based emulation, it spins up dedicated builders for each architecture in parallel. This results in faster, more reliable outputs and lets you build once for multiple targets.'),
    ]),
    heading('h3', [textNode('Key Benefits')]),
    bulletList([
      [textNode('Native builds avoid emulation slowdowns')],
      [textNode('ARM64 and AMD64 built in parallel')],
      [textNode('Multi-arch manifest support under a single image tag')],
    ]),
    paragraph([italicText('Example CLI Command')]),
    paragraph([
      textNode('docker buildx build \\\n  --platform linux/amd64,linux/arm64 \\\n  --builder my-org-cloud-builder \\\n  --push --tag myregistry.com/myapp:1.0'),
    ]),
    paragraph([
      boldText('Note: '),
      textNode('Docker Build Cloud uses docker buildx as its CLI entry point. '),
      linkNode('Docker Build Cloud Overview', 'https://docs.docker.com/build-cloud/'),
      textNode('.'),
    ]),

    // --- Streamlined Deployment with CAEPE ---
    heading('h2', [textNode('Streamlined Deployment with CAEPE')]),
    paragraph([
      textNode('CAEPE is a Kubernetes-native continuous deployment platform built for teams managing mixed-infrastructure environments. It coordinates builds and deployments without overhauling your CI/CD pipelines.'),
    ]),
    paragraph([textNode('Key capabilities:')]),
    bulletList([
      [textNode('Build once and deploy across ARM64 and x86_64 environments')],
      [textNode('Detect and route workloads to architecture-compatible nodes')],
      [textNode('Enforce security and audit policies across both build targets')],
      [textNode('Reuse shared YAML without hardcoding architecture-specific logic')],
    ]),
    paragraph([italicText('Declarative Example:')]),
    paragraph([
      textNode('build:\n  context: .\n  docker:\n    platforms: ["linux/amd64", "linux/arm64"]\n    tag: myregistry.com/app:1.0\n    builder: docker-cloud\ndeploy:\n  strategy: rolling\n  targets:\n    - name: production\n      cluster: eks-arm\n    - name: staging\n      cluster: aks-x86'),
    ]),
    paragraph([
      textNode('CAEPE uses architecture-aware manifests and native Kubernetes scheduling rules (e.g. node selectors, affinity rules) to automate workload placement. That means:'),
    ]),
    bulletList([
      [textNode('No brittle nodeSelector logic')],
      [textNode('No duplicated Helm/Kustomize templates')],
      [textNode('No surprises at runtime due to incompatible architectures')],
    ]),
    heading('h3', [textNode('Test, Promote, Rollback')]),
    paragraph([textNode('CAEPE can also:')]),
    bulletList([
      [textNode('Run smoke tests per architecture before rollout')],
      [textNode('Promote only if both ARM64 and x86_64 pass health checks')],
      [textNode('Roll back selectively if one variant fails')],
    ]),
    paragraph([
      textNode('This adds resilience—without duplicating YAML or adding brittle logic.'),
    ]),

    // --- Security & Compliance ---
    heading('h2', [textNode('Security & Compliance: No Compromise Required')]),
    paragraph([
      textNode('Multi-architecture support is not just about builds and deployments—it also needs to work with your '),
      boldText('security and compliance pipeline'),
      textNode('. A common concern is whether adopting ARM introduces gaps in visibility, policy enforcement, or audit trail. The good news? It does not.'),
    ]),
    paragraph([
      textNode('Most modern security tooling now supports ARM64 out of the box. Vulnerability scanners, image signers, SBOM generators, and Kubernetes policy engines can secure both x86_64 and ARM workloads consistently.'),
    ]),
    paragraph([boldText('Key Tools:')]),
    bulletList([
      [linkNode('Trivy', 'https://trivy.dev/latest/'), textNode(' – Scans ARM and x86_64 images')],
      [linkNode('Syft', 'https://github.com/anchore/syft'), textNode(' – Generates SBOMs for multi-arch containers')],
      [linkNode('Cosign', 'https://github.com/sigstore/cosign'), textNode(' – Signs and verifies container images regardless of architecture')],
      [linkNode('Kyverno', 'https://kyverno.io/'), textNode(' / '), linkNode('Gatekeeper', 'https://github.com/open-policy-agent/gatekeeper'), textNode(' – Enforce policy uniformly across platforms')],
    ]),
    paragraph([
      textNode('When paired with platforms like CAEPE, which also extends '),
      linkNode('GitOps workflows', 'https://caepe.sh/simplify-gitops/'),
      textNode(', these tools integrate into the pipeline naturally so every build, scan, sign, and deploy step stays covered.'),
    ]),
    paragraph([textNode('You expand your footprint—not your risk.')]),

    // --- Where Strategy Meets Execution ---
    heading('h2', [textNode('Where Strategy Meets Execution')]),
    paragraph([
      textNode('Multi-architecture is a smart strategy, and now with modern tooling, it is an operational reality. Teams can deploy reliably across ARM and x86_64 without duplicating effort or compromising on governance.'),
    ]),
    paragraph([
      textNode('The teams that win will be those who adapt early, simplify smartly, and stay platform-flexible.'),
    ]),
    paragraph([
      textNode('Whether improving pipelines or future-proofing infrastructure, multi-architecture unlocks options that matter today, not someday.'),
    ]),
    paragraph([
      textNode('Making the business case? '),
      linkNode('Part 1', 'https://caepe.sh/multi-architecture-arm-x64-at-scale/'),
      textNode(' outlines the costs and use cases.'),
    ]),

    // --- Try It Yourself ---
    heading('h2', [textNode('Try It Yourself: Quick Multi-Architecture POC')]),
    paragraph([
      textNode('Curious about multi-architecture delivery but not ready to overhaul your setup? Here is a fast, low-risk way to try it.'),
    ]),
    paragraph([boldText('1. Build with Docker Build Cloud')]),
    bulletList([
      [textNode('Select a small, stateless service and use '), boldText('Docker Build Cloud'), textNode(' to build multi-architecture images (ARM64 and x86_64/amd64).')],
      [textNode('Push the output to your container registry—no local emulation or custom scripting required.')],
    ]),
    paragraph([boldText('2. Deploy with CAEPE (Free Pilot Available)')]),
    paragraph([
      textNode('Use '),
      boldText('CAEPE'),
      textNode(' to deploy architecture-specific images securely and efficiently. CAEPE supports:'),
    ]),
    bulletList([
      [textNode('Architecture-aware logic in deployment manifests')],
      [textNode('Reusable pipelines across ARM64 and x86_64 environments')],
      [textNode('Integrated policy and audit controls')],
    ]),
    paragraph([
      textNode('To test this setup more fully, you can:'),
    ]),
    bulletList([
      [textNode('Spin up a test Kubernetes cluster (e.g., with kind, minikube, or a managed service)')],
      [textNode('Deploy an architecture-aware workload to validate targeting and scheduling')],
    ]),
    paragraph([
      boldText('CAEPE offers a complimentary 6-week enterprise pilot with unlimited clusters'),
      textNode(', fully supported by our team. '),
      linkNode('Test drive CAEPE', 'https://caepe.sh/caepe-test-drive/'),
      textNode(' now or email us at '),
      linkNode('connect@biqmind.com', 'mailto:connect@biqmind.com'),
      textNode(' to book a walkthrough.'),
    ]),
  ])
}

// --- Article 2: Navigating Continuous Deployment in Highly Regulated Industries ---

function buildRegulatedContent(): any {
  return lexicalRoot([
    heading('h2', [textNode('Introduction')]),
    paragraph([
      textNode('Healthcare, financial services, and aviation organizations lose millions each year due to deployment-related compliance violations and security breaches. Many companies now adopt rapid software delivery through continuous deployment and DevOps practices. However, teams operating in highly regulated industries face unique challenges balancing rapid execution with strict regulatory requirements.'),
    ]),
    paragraph([
      textNode('Implementing continuous deployment while staying compliant requires careful attention to security controls, audit trails, and validation processes. Healthcare organizations must adhere to HIPAA guidelines, financial institutions comply with SOX and PCI-DSS, and aerospace companies follow DO-178C standards.'),
    ]),
    paragraph([
      textNode('This guide explores strategies to implement continuous deployment within regulatory constraints. It provides insights into compliance frameworks, secure deployment pipelines, safer deployment patterns, and risk management approaches. Development team leads and engineering managers will gain practical methods to accelerate software delivery while maintaining regulatory compliance.'),
    ]),

    // --- Understanding Regulatory Requirements ---
    heading('h2', [textNode('Understanding Regulatory Requirements')]),
    paragraph([
      textNode('To effectively implement DevOps and CI/CD practices in regulated industries, IT teams must thoroughly understand compliance frameworks and how to apply them to meet regulatory requirements. Below, we outline key elements enabling compliant continuous deployment practices.'),
    ]),

    heading('h3', [textNode('Common Compliance Frameworks')]),
    paragraph([
      textNode('Organizations in regulated industries must follow compliance frameworks specific to their sector and data handling processes. Key frameworks include:'),
    ]),
    bulletList([
      [boldText('HIPAA:'), textNode(' Mandatory for healthcare providers handling patient health information')],
      [boldText('PCI DSS:'), textNode(' Required for organizations processing credit card data')],
      [boldText('SOX:'), textNode(' Essential for public companies managing financial reporting')],
      [boldText('FedRAMP:'), textNode(' Necessary for cloud services used by federal agencies')],
      [boldText('GDPR:'), textNode(' Critical for organizations handling data of EU citizens')],
      [boldText('CIS Benchmarks:'), textNode(' Globally recognized best practices for securing systems, applications, and networks, helping organizations harden servers, secure cloud workloads, and streamline compliance.')],
    ]),

    heading('h3', [textNode('Security Control Requirements')]),
    paragraph([
      textNode('Meeting strict regulatory standards requires robust security controls. Organizations must '),
      linkNode('secure all CI/CD process components', 'https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html'),
      textNode(' through measures such as:'),
    ]),
    bulletList([
      [textNode('Role-based authentication with strict access controls')],
      [textNode('Proper credential management and hygiene')],
      [textNode('Secure system configurations')],
      [textNode('Security validation for third-party services')],
      [textNode('Implementation of infrastructure as code for consistent and auditable deployments')],
    ]),

    heading('h3', [textNode('Audit Trail Necessities')]),
    paragraph([
      textNode('Detailed audit trails are essential for regulatory compliance and security. For example, HIPAA mandates healthcare organizations to maintain secure audit logs for '),
      linkNode('at least six years', 'https://www.hipaajournal.com/hipaa-retention-requirements'),
      textNode(', while SOX requires public companies to retain audit logs for a minimum of seven years.'),
    ]),
    paragraph([
      linkNode('Audit trails', 'https://docs.aws.amazon.com/wellarchitected/latest/devops-guidance/ag.ca.1-establish-comprehensive-audit-trails.html'),
      textNode(' should capture every action in the environment, documenting commits, peer reviews, and the individuals involved in each deployment step. This comprehensive logging ensures traceability and supports security and audit teams during compliance reviews.'),
    ]),

    heading('h3', [textNode('Observability')]),
    paragraph([
      textNode('Observability is vital for ensuring compliance and maintaining system reliability in regulated industries. Collecting and analyzing telemetry data—such '),
      linkNode('as logs, metrics, and traces', 'https://www.honeycomb.io/blog/they-arent-pillars-theyre-lenses'),
      textNode('—provides real-time insights into system performance and facilitates the early detection of potential issues.'),
    ]),
    paragraph([textNode('Key components include:')]),
    bulletList([
      [boldText('Centralized Logging:'), textNode(' Aggregates logs in a secure, searchable location for faster investigations and compliance reporting.')],
      [boldText('Metrics Monitoring:'), textNode(' Tracks system health and performance to identify potential risks.')],
      [boldText('Distributed Tracing:'), textNode(' Maps request flows across distributed systems to pinpoint bottlenecks and maintain transparency.')],
    ]),
    paragraph([
      textNode('To align with compliance requirements, observability tools must securely store data, support detailed audit reporting, and implement access controls. Integrating observability with CI/CD pipelines ensures continuous monitoring, proactive issue resolution, and adherence to regulatory standards.'),
    ]),

    // --- Building Compliant Deployment Pipelines ---
    heading('h2', [textNode('Building Compliant Deployment Pipelines')]),
    paragraph([
      textNode('Building secure and compliant deployment pipelines needs a systematic way to automate and confirm changes. Adding automated security checks throughout the CI/CD pipeline helps catch vulnerabilities early and ensure compliance with regulatory standards.'),
    ]),

    heading('h3', [textNode('Automated Testing and Validation')]),
    paragraph([
      textNode('Focus on continuous checks to confirm compliance at each stage. Consider implementing detailed testing that covers static application security testing (SAST) and dynamic application security testing (DAST) for all development languages.'),
    ]),
    paragraph([
      boldText('Static Application Security Testing'),
      textNode(' (SAST) is a proactive security method that examines source code, bytecode, or binaries to detect vulnerabilities at the early stages of development. SAST detects issues such as insecure coding practices, buffer overflows, and SQL injection risks by analyzing static code prior to deployment. '),
      linkNode('Integrating SAST into CI/CD pipelines', 'https://checkmarx.com/learn/sast/shift-left-security-integrate-sast-into-devsecops-pipeline/'),
      textNode(' ensures continuous scanning during the build process, allowing developers to address vulnerabilities before they reach production.'),
    ]),
    paragraph([
      boldText('Dynamic Application Security Testing (DAST)'),
      textNode(' is an essential method for uncovering vulnerabilities in active applications by mimicking real-world attack scenarios. Unlike SAST, which examines static code, DAST operates at runtime to uncover issues such as authentication flaws, SQL injection, and cross-site scripting. By integrating DAST into CI/CD pipelines, organizations can proactively identify vulnerabilities during the build process, ensuring compliance with regulatory frameworks.'),
    ]),

    heading('h3', [textNode('Security Scanning Integration')]),
    paragraph([textNode('Use multiple security scanning tools to create resilient defense mechanisms:')]),
    bulletList([
      [boldText('Static Code Analysis:'), textNode(' Catches vulnerabilities early')],
      [boldText('Container Scanning:'), textNode(' Checks container configurations and dependencies')],
      [boldText('Dependency Analysis:'), textNode(' Reviews software composition (SCA) to evaluate external components')],
    ]),
    paragraph([
      textNode('Design your security scanning to align with '),
      linkNode('NIST SP 800-204D guidelines', 'https://cycode.com/blog/secure-cicd-pipelines-guidelines-nist-sp-800-204d/'),
      textNode(', which provide a detailed framework for enhancing CI/CD pipeline security.'),
    ]),

    heading('h3', [textNode('Documentation Automation')]),
    paragraph([
      textNode('Documentation automation is vital to maintain compliance in heavily regulated industries. Best practices include automatically creating and updating:'),
    ]),
    bulletList([
      [textNode('Detailed audit trails of pipeline activities')],
      [textNode('Software Bill of Materials (SBOM) for every build')],
      [textNode('Validation proof and compliance reports')],
    ]),
    paragraph([
      textNode('Automated documentation reduces the manual workload typically associated with validation processes, streamlining compliance reporting and preparation for audits.'),
    ]),

    // --- Implementing Deployment Patterns ---
    heading('h2', [textNode('Implementing Deployment Patterns')]),
    paragraph([
      textNode('Certain deployment patterns reduce risk by a lot while you retain control of compliance. Here are three proven patterns that help achieve both speed and security.'),
    ]),

    heading('h3', [textNode('Blue-Green Deployments')]),
    paragraph([
      linkNode('Blue-green deployments', 'https://caepe.sh/progressive-delivery-primer/'),
      textNode(' use two similar production environments to ensure zero-downtime releases and compliance. This approach allows testing new versions in a production-like environment before switching traffic, enabling instant rollback if issues arise.'),
    ]),

    heading('h3', [textNode('Canary Releases')]),
    paragraph([
      linkNode('Canary deployments', 'https://caepe.sh/canary-deployments-kubernetes/'),
      textNode(' roll out changes incrementally to a small user group before a broader release. Starting with a small subset and increasing exposure based on performance metrics helps detect compliance issues early, limiting impact to controlled user groups.'),
    ]),

    heading('h3', [textNode('Feature Toggles')]),
    paragraph([textNode('Feature toggles manage feature releases while maintaining compliance by allowing:')]),
    bulletList([
      [textNode('Enabling/disabling features '), linkNode('without code deployment', 'https://apptimize.com/blog/2019/07/product-managers-guide-feature-flags-release-management/')],
      [textNode('Controlling feature access for specific user groups')],
      [textNode('Rolling out features in phases')],
      [textNode('Keeping detailed audit trails of feature changes')],
    ]),
    paragraph([
      textNode('Feature toggles are '),
      linkNode('critical in regulated environments', 'https://www.getunleash.io/fedramp-soc2-feature-flags'),
      textNode(', as they provide complete audit logs of all changes, reducing deployment risk while maintaining the agility needed for continuous deployment.'),
    ]),

    // --- Risk Management Strategies ---
    heading('h2', [textNode('Risk Management Strategies')]),
    paragraph([
      textNode('Risk management is essential for successful continuous deployment in highly regulated industries. Taking a proactive stance on risk assessment and mitigation reduces the chances of expensive deployment failures.'),
    ]),

    heading('h3', [textNode('Deployment Risk Assessment')]),
    paragraph([textNode('A thorough risk assessment is critical before any deployment. Key areas of focus include:')]),
    bulletList([
      [textNode('System compatibility checks')],
      [textNode('Performance impact analysis')],
      [textNode('Security vulnerability scanning')],
      [textNode('Compliance requirement validation')],
      [textNode('Evaluation of artificial intelligence and machine learning components, if applicable')],
    ]),

    heading('h3', [textNode('Rollback Procedures')]),
    paragraph([
      textNode('Reliable rollback procedures are a crucial aspect of a continuous deployment system, providing a safety net for developers deploying code to production. Organizations without well-defined rollback plans often experience prolonged outages, compromised security, and significant financial losses. A robust rollback strategy should include:'),
    ]),
    bulletList([
      [textNode('Step-by-step instructions for rolling back changes')],
      [textNode('Clear team member responsibilities')],
      [textNode('Documentation of all actions taken during rollbacks')],
    ]),
    paragraph([
      linkNode('Documenting rollback procedures', 'https://www.bluevoyant.com/knowledge-center/incident-response-plan-steps-and-8-critical-considerations'),
      textNode(' ensures compliance, creates detailed records for audits, and improves future processes.'),
    ]),

    heading('h3', [textNode('Incident Response Planning')]),
    paragraph([
      textNode('An incident response plan combining preventive and reactive measures is critical. Cross-functional teams involving IT, security, legal, and communications stakeholders should:'),
    ]),
    bulletList([
      [textNode('Conduct regular drills to identify gaps')],
      [textNode('Define roles and responsibilities clearly')],
      [textNode('Align response protocols with regulatory requirements')],
    ]),
    paragraph([
      textNode('Proactive training enhances readiness, enabling faster and more effective incident handling while minimizing disruptions and maintaining compliance.'),
    ]),

    // --- Conclusion ---
    heading('h2', [textNode('Conclusion')]),
    paragraph([
      textNode('Organizations in regulated industries must balance speed and compliance to implement continuous deployment successfully. Industry practices demonstrate that this balance is achievable through systematic approaches to security, automation, and risk management.'),
    ]),
    paragraph([
      textNode('Automated testing and validation can reduce validation time by 60-70% without compromising compliance standards. Deployment patterns such as blue-green deployments, canary releases, and feature toggles provide secure paths to production while meeting regulatory requirements.'),
    ]),

    heading('h3', [textNode('Key Takeaways')]),
    bulletList([
      [textNode('Comprehensive security controls and audit trails are foundational to compliant deployments.')],
      [textNode('Automated documentation and testing reduce manual effort and human error significantly.')],
      [textNode('Risk management strategies, including reliable rollback procedures, protect against costly failures.')],
      [textNode('Cross-functional incident response teams strengthen deployment security.')],
    ]),
    paragraph([
      textNode('Continuous deployment in regulated industries is an ongoing process of improvement and adaptation. Start small, focus on automation, and expand deployment capabilities incrementally while adhering to stringent compliance standards.'),
    ]),

    // --- References ---
    heading('h2', [textNode('References')]),
    orderedList([
      [linkNode('Best Practices for Developing Software for Regulated Industries', 'https://simplexitypd.com/whitepaper/best-practices-for-developing-software-for-regulated-industries/')],
      [linkNode('Compliance and Regulatory Frameworks', 'https://www.rapid7.com/fundamentals/compliance-regulatory-frameworks/')],
      [linkNode('Building Secure CI/CD Pipelines: Key Strategies from NIST SP 800-204D', 'https://cycode.com/blog/secure-cicd-pipelines-guidelines-nist-sp-800-204d/')],
    ]),
  ])
}

// --- Main ---

async function main() {
  console.log('Initialising Payload...')
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  // --- Download and upload featured images ---
  const images = [
    {
      url: 'https://caepe.sh/wp-content/uploads/2025/07/FeaturedImage-ScalingSmarterPart2.png',
      filename: 'FeaturedImage-ScalingSmarterPart2.png',
      alt: 'Making Multi-Architecture Work in Practice',
    },
    {
      url: 'https://caepe.sh/wp-content/uploads/2025/01/healthcare.png',
      filename: 'healthcare.png',
      alt: 'Navigating Continuous Deployment in Highly Regulated Industries',
    },
  ]

  const mediaIds: number[] = []

  for (const img of images) {
    // Check if already uploaded
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: img.filename } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  Image "${img.filename}" already exists (id: ${existing.docs[0].id})`)
      mediaIds.push(existing.docs[0].id as number)
      continue
    }

    const tmpFile = join(tmpdir(), img.filename)
    console.log(`  Downloading ${img.url}...`)
    await downloadFile(img.url, tmpFile)

    console.log(`  Uploading ${img.filename} to Media...`)
    const media = await payload.create({
      collection: 'media',
      data: { alt: img.alt },
      file: {
        data: readFileSync(tmpFile),
        name: img.filename,
        mimetype: 'image/png',
        size: readFileSync(tmpFile).length,
      },
    })
    mediaIds.push(media.id as number)
    console.log(`  Uploaded: ${img.filename} (id: ${media.id})`)
  }

  // --- Download Docker Build Cloud image ---
  const dockerImg = {
    url: 'https://caepe.sh/wp-content/uploads/2025/06/DockerBuildcloud.png',
    filename: 'DockerBuildcloud.png',
    alt: 'Docker Build Cloud for Multi-Architecture',
  }
  const existingDocker = await payload.find({
    collection: 'media',
    where: { filename: { equals: dockerImg.filename } },
    limit: 1,
  })
  if (existingDocker.docs.length === 0) {
    const tmpFile = join(tmpdir(), dockerImg.filename)
    console.log(`  Downloading ${dockerImg.url}...`)
    await downloadFile(dockerImg.url, tmpFile)
    console.log(`  Uploading ${dockerImg.filename} to Media...`)
    await payload.create({
      collection: 'media',
      data: { alt: dockerImg.alt },
      file: {
        data: readFileSync(tmpFile),
        name: dockerImg.filename,
        mimetype: 'image/png',
        size: readFileSync(tmpFile).length,
      },
    })
    console.log(`  Uploaded: ${dockerImg.filename}`)
  }

  // --- Create Article 1: Multi-Architecture ---
  const slug1 = 'multi-architecture-in-practice'
  const existing1 = await payload.find({
    collection: 'resources',
    where: { slug: { equals: slug1 } },
    limit: 1,
  })

  if (existing1.docs.length > 0) {
    console.log(`\nArticle "${slug1}" already exists — updating...`)
    await payload.update({
      collection: 'resources',
      id: existing1.docs[0].id,
      data: {
        title: 'Scaling Smarter, Part 2: Making Multi-Architecture Work in Practice',
        excerpt: 'Learn how teams build, secure and deploy across ARM64 and X86_64 environments securely and efficiently.',
        content: buildMultiArchContent(),
        feature_image: mediaIds[0],
        author: 'Team CAEPE',
        publish_date: '2025-07-10',
        reading_time: 10,
        tags: [
          { tag: 'Multi-Architecture' },
          { tag: 'ARM64' },
          { tag: 'DevOps' },
          { tag: 'Docker' },
        ],
        meta: {
          meta_title: 'Scaling Smarter, Part 2: Making Multi-Architecture Work in Practice — CAEPE',
          meta_description: 'Learn how modern DevOps teams can streamline multi-architecture delivery with Docker Build Cloud and CAEPE—enabling secure, scalable pipelines across ARM64 and x64 environments.',
        },
        _status: 'published',
      },
    })
    console.log('  Updated and published.')
  } else {
    console.log('\nCreating article: Multi-Architecture in Practice...')
    await payload.create({
      collection: 'resources',
      data: {
        title: 'Scaling Smarter, Part 2: Making Multi-Architecture Work in Practice',
        slug: slug1,
        excerpt: 'Learn how teams build, secure and deploy across ARM64 and X86_64 environments securely and efficiently.',
        content: buildMultiArchContent(),
        feature_image: mediaIds[0],
        author: 'Team CAEPE',
        publish_date: '2025-07-10',
        reading_time: 10,
        tags: [
          { tag: 'Multi-Architecture' },
          { tag: 'ARM64' },
          { tag: 'DevOps' },
          { tag: 'Docker' },
        ],
        meta: {
          meta_title: 'Scaling Smarter, Part 2: Making Multi-Architecture Work in Practice — CAEPE',
          meta_description: 'Learn how modern DevOps teams can streamline multi-architecture delivery with Docker Build Cloud and CAEPE—enabling secure, scalable pipelines across ARM64 and x64 environments.',
        },
        _status: 'published',
      },
    })
    console.log('  Created and published.')
  }

  // --- Create Article 2: Regulated Industries ---
  const slug2 = 'navigating-continuous-deployment-in-highly-regulated-industries'
  const existing2 = await payload.find({
    collection: 'resources',
    where: { slug: { equals: slug2 } },
    limit: 1,
  })

  if (existing2.docs.length > 0) {
    console.log(`\nArticle "${slug2}" already exists — updating...`)
    await payload.update({
      collection: 'resources',
      id: existing2.docs[0].id,
      data: {
        title: 'Navigating Continuous Deployment in Highly Regulated Industries',
        excerpt: 'Implement Continuous Deployment in regulated industries like healthcare, finance, and aviation. Learn strategies for compliance, security, and risk management.',
        content: buildRegulatedContent(),
        feature_image: mediaIds[1],
        author: 'Tahir Javed',
        publish_date: '2024-11-05',
        reading_time: 12,
        tags: [
          { tag: 'Continuous Deployment' },
          { tag: 'Compliance' },
        ],
        meta: {
          meta_title: 'Navigating Continuous Deployment in Highly Regulated Industries — CAEPE',
          meta_description: 'Implement Continuous Deployment in regulated industries like healthcare, finance, and aviation. Learn strategies for compliance, security, and risk management.',
        },
        _status: 'published',
      },
    })
    console.log('  Updated and published.')
  } else {
    console.log('\nCreating article: Navigating CD in Regulated Industries...')
    await payload.create({
      collection: 'resources',
      data: {
        title: 'Navigating Continuous Deployment in Highly Regulated Industries',
        slug: slug2,
        excerpt: 'Implement Continuous Deployment in regulated industries like healthcare, finance, and aviation. Learn strategies for compliance, security, and risk management.',
        content: buildRegulatedContent(),
        feature_image: mediaIds[1],
        author: 'Tahir Javed',
        publish_date: '2024-11-05',
        reading_time: 12,
        tags: [
          { tag: 'Continuous Deployment' },
          { tag: 'Compliance' },
        ],
        meta: {
          meta_title: 'Navigating Continuous Deployment in Highly Regulated Industries — CAEPE',
          meta_description: 'Implement Continuous Deployment in regulated industries like healthcare, finance, and aviation. Learn strategies for compliance, security, and risk management.',
        },
        _status: 'published',
      },
    })
    console.log('  Created and published.')
  }

  // --- Set related posts to point at each other ---
  const art1 = await payload.find({ collection: 'resources', where: { slug: { equals: slug1 } }, limit: 1 })
  const art2 = await payload.find({ collection: 'resources', where: { slug: { equals: slug2 } }, limit: 1 })

  if (art1.docs[0] && art2.docs[0]) {
    await payload.update({ collection: 'resources', id: art1.docs[0].id, data: { related_posts: [art2.docs[0].id] } })
    await payload.update({ collection: 'resources', id: art2.docs[0].id, data: { related_posts: [art1.docs[0].id] } })
    console.log('\nLinked articles as related posts.')
  }

  console.log('\nDone! Both articles are published and visible at /resources.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
