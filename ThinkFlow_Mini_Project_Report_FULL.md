# Kolhapur Institute of Technology's College of Engineering (Empowered Autonomous), Kolhapur

---

## **"ThinkFlow: AI-Powered Real-Time Factory Safety Monitoring System"**

Submitted in partial fulfillment of the requirements of the degree of

### Mini Project-IV â€” UCBIL0671

**By**

| Roll No. | Name | PRN |
|----------|------|-----|
| ___ | _________________ | _________________ |
| ___ | _________________ | _________________ |
| ___ | _________________ | _________________ |

**Under the Supervision of**

**Mrs. Yashaswini A. Kadiyal**
Asst. Professor, Department of CSBS

**Department of Computer Science and Business Systems**
KITCOE, Kolhapur
May, 2026

---

## CERTIFICATE

This is to certify that the following students of Second Year Computer Science and Business Systems has submitted Mini Project-IV report entitled **"ThinkFlow: AI-Powered Real-Time Factory Safety Monitoring System"** in partial fulfillment for the course code **"UCBIL0671"**, in the academic year 2025-26. It has been found to be satisfactory and hereby approved for submission.

| Sr. No. | Name | PRN |
|---------|------|-----|
| 1 | _________________ | _________________ |
| 2 | _________________ | _________________ |
| 3 | _________________ | _________________ |

**Guide Name:** Mrs. Yashaswini Kadiyal
Asst. Prof., CSBS

---

## ACKNOWLEDGEMENT

We would like to express our sincere gratitude to our project guide **Mrs. Yashaswini A. Kadiyal**, Assistant Professor, Department of Computer Science and Business Systems, KITCOE Kolhapur, for her invaluable guidance, constant encouragement, and support throughout the development of this project.

We are also grateful to the **Head of Department of CSBS** for providing us the opportunity and resources to work on this project. We thank the entire faculty of the CSBS department for their knowledge and motivation.

We extend our thanks to **KIT's College of Engineering, Kolhapur** for providing the necessary infrastructure, lab facilities, and computing resources.

Finally, we thank our family and friends for their continuous encouragement during this academic endeavor.

---

## ABSTRACT

Industrial safety remains a critical concern in manufacturing environments worldwide. Traditional safety monitoring approaches rely heavily on human supervision, which is prone to fatigue, inattention, and delayed response times. This project presents **ThinkFlow**, an AI-powered real-time factory safety monitoring system that leverages computer vision and deep learning to automatically detect human presence in designated danger zones and trigger instant alerts.

The system is built using a **microservices architecture** comprising three independent services: (1) a **Python AI Service** utilizing YOLOv8 for real-time human detection and ByteTrack for persistent object tracking, (2) a **Java Spring Boot Backend** serving as the API gateway with JWT authentication, WebSocket communication, danger zone logic, and SQLite database management, and (3) a **React Frontend** providing a modern, dark-themed dashboard for real-time monitoring, camera management, zone configuration, and event history.

Key features include multi-camera support, polygon-based danger zone definition with ray-casting breach detection, a 30-second alert cooldown system, STOMP WebSocket for instant alert delivery, and audible sound notifications using the Web Audio API. The system operates fully offline on a local network with no cloud dependency, making it suitable for secure industrial environments.

Testing demonstrated that the system successfully detects human presence with high accuracy (~85-95% confidence), maintains persistent tracking IDs across frames, and delivers zone breach alerts within 200ms of detection. The modular architecture enables easy extension for future capabilities such as PPE detection, sensor integration, and multi-factory deployment.

**Keywords:** Computer Vision, YOLOv8, Object Detection, Factory Safety, Real-Time Monitoring, Microservices, WebSocket, Spring Boot, React, Deep Learning

---

## INDEX

| S.No | Topic | Page No |
|------|-------|---------|
| 1. | Introduction | 1 |
| 2. | Literature Review | 4 |
| 3. | Statement of Problem | 7 |
| 4. | Objectives of the Study | 8 |
| 5. | Software Requirement Specification | 9 |
| 6. | Detailed Design | 12 |
| 7. | Implementation | 16 |
| 8. | Results and Discussion | 22 |
| 9. | Conclusion & Future Scope | 25 |
| 10. | References | 27 |

---

## LIST OF FIGURES

| S.No | Figure No | Description | Page No |
|------|-----------|-------------|---------|
| 1. | Fig 1.1 | System Architecture Diagram | 3 |
| 2. | Fig 2.1 | YOLOv8 Model Architecture | 5 |
| 3. | Fig 5.1 | Use Case Diagram | 10 |
| 4. | Fig 6.1 | Microservices Architecture | 12 |
| 5. | Fig 6.2 | Database ER Diagram | 13 |
| 6. | Fig 6.3 | Sequence Diagram - Detection Flow | 14 |
| 7. | Fig 6.4 | Component Diagram | 15 |
| 8. | Fig 7.1 | Project Directory Structure | 16 |
| 9. | Fig 8.1 | Login Page Screenshot | 22 |
| 10. | Fig 8.2 | Dashboard Page Screenshot | 22 |
| 11. | Fig 8.3 | Camera Management Screenshot | 23 |
| 12. | Fig 8.4 | Zone Management Screenshot | 23 |
| 13. | Fig 8.5 | Event History Screenshot | 24 |
| 14. | Fig 8.6 | Real-time Detection Screenshot | 24 |
| 15. | Fig 8.7 | Alert Notification Screenshot | 24 |

## LIST OF TABLES

| S.No | Table No | Description | Page No |
|------|----------|-------------|---------|
| 1. | Table 5.1 | Hardware Requirements | 9 |
| 2. | Table 5.2 | Software Requirements | 10 |
| 3. | Table 6.1 | REST API Endpoints | 14 |
| 4. | Table 6.2 | Database Schema | 13 |
| 5. | Table 8.1 | Detection Performance Results | 25 |

---

# CHAPTER 1: INTRODUCTION

## 1.1 Background

Industrial workplaces, particularly manufacturing factories, remain among the most hazardous environments for workers globally. According to the International Labour Organization (ILO), approximately 2.78 million workers die annually due to occupational accidents and work-related diseases, with an additional 374 million non-fatal injuries occurring each year [1]. In India alone, the National Crime Records Bureau (NCRB) reports over 50,000 workplace fatalities annually, with the manufacturing sector accounting for a significant portion [2].

Traditional factory safety monitoring relies primarily on human supervisors, CCTV operators, and periodic safety audits. However, these approaches suffer from critical limitations: human operators experience fatigue during long shifts, may fail to notice hazards in real-time, and cannot simultaneously monitor multiple camera feeds with consistent attention. Research indicates that CCTV monitoring effectiveness drops by approximately 45% after just 20 minutes of continuous observation [3].

The rapid advancement of **Artificial Intelligence (AI)** and **Computer Vision** technologies has opened new avenues for automated safety monitoring. Deep learning models, particularly object detection architectures like YOLO (You Only Look Once), have achieved remarkable accuracy in real-time detection tasks, processing video frames at speeds exceeding 30 FPS while maintaining high precision [4]. These technologies can be deployed to continuously monitor factory floors, detect human presence in restricted areas, and trigger instant alerts without human intervention.

## 1.2 Project Overview

**ThinkFlow** is an AI-powered, real-time factory safety monitoring system designed to detect humans in camera feeds, monitor designated danger zones, and trigger instant alerts when safety breaches occur. The system is built using a clean **microservices architecture** with three independent services:

1. **Python AI Service** â€” Performs real-time human detection using YOLOv8 and object tracking using ByteTrack
2. **Java Spring Boot Backend** â€” Manages cameras, zones, events, authentication, and alert broadcasting
3. **React Frontend** â€” Provides a modern, real-time dashboard for monitoring and management

The system operates entirely offline on a local network, requiring no cloud connectivity, making it suitable for secure industrial environments where data privacy is paramount.

## 1.3 Motivation

The motivation behind this project stems from several critical observations:

- **Human Limitation in Monitoring:** Factory supervisors cannot watch multiple camera feeds simultaneously for extended periods without fatigue-induced lapses [3].
- **Delayed Response Times:** Traditional systems often detect safety breaches only after incidents occur, rather than preventing them in real-time.
- **Scalability Issues:** Manual monitoring does not scale â€” adding more cameras requires proportionally more human operators.
- **Cost of Workplace Accidents:** The ILO estimates that occupational accidents cost approximately 3.94% of global GDP annually [1], making prevention economically critical.
- **Advancements in AI:** Modern object detection models like YOLOv8 can process video in real-time with high accuracy, making automated monitoring technically feasible and affordable.

## 1.4 Scope of the Project

The scope of ThinkFlow includes:
- Real-time human detection from multiple camera feeds
- Persistent person tracking with unique IDs across frames
- Configurable polygon-based danger zone definition
- Instant alert notifications via WebSocket with audible sound
- User authentication and role-based access
- Event logging with searchable history
- Multi-camera management through a web-based interface
- Fully offline, local network operation

```
Fig 1.1: System Architecture Diagram

â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚   React Frontend   â”‚â—„â”€â”€WSâ”€â”€â–ºâ”‚   Spring Boot API    â”‚â—„â”€â”€RESTâ”€â–ºâ”‚  Python AI Svc  â”‚
â”‚    (port 5173)     â”‚  REST   â”‚    (port 8080)       â”‚         â”‚   (port 5000)   â”‚
â”‚                    â”‚         â”‚                      â”‚         â”‚                 â”‚
â”‚ â€¢ Login Page       â”‚         â”‚ â€¢ JWT Auth           â”‚         â”‚ â€¢ YOLOv8 Model  â”‚
â”‚ â€¢ Dashboard        â”‚         â”‚ â€¢ Camera CRUD        â”‚         â”‚ â€¢ ByteTrack     â”‚
â”‚ â€¢ Camera Mgmt      â”‚         â”‚ â€¢ Zone CRUD          â”‚         â”‚ â€¢ Multi-Camera  â”‚
â”‚ â€¢ Zone Mgmt        â”‚         â”‚ â€¢ Detection Engine   â”‚         â”‚ â€¢ MJPEG Stream  â”‚
â”‚ â€¢ Event History    â”‚         â”‚ â€¢ Alert + Cooldown   â”‚         â”‚                 â”‚
â”‚ â€¢ WebSocket Client â”‚         â”‚ â€¢ WebSocket Server   â”‚         â”‚                 â”‚
â”‚ â€¢ Sound Alerts     â”‚         â”‚ â€¢ SQLite Database    â”‚         â”‚                 â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

# CHAPTER 2: LITERATURE REVIEW

## 2.1 Object Detection in Industrial Safety

Object detection has evolved significantly over the past decade, transitioning from traditional handcrafted feature-based methods to deep learning approaches. Redmon et al. (2016) introduced YOLO (You Only Look Once), a unified architecture that frames object detection as a single regression problem, enabling real-time processing at 45 FPS [5]. Subsequent versionsâ€”YOLOv2, YOLOv3, YOLOv4â€”progressively improved accuracy and speed, with Bochkovskiy et al. (2020) demonstrating YOLOv4's effectiveness in industrial applications [6].

Jocher et al. (2023) released **YOLOv8** through Ultralytics, introducing architectural improvements including a C2f module for better feature extraction, anchor-free detection heads, and improved training pipelines [7]. YOLOv8 achieves state-of-the-art performance on the COCO dataset with 53.9% mAP@50-95 in its largest variant while maintaining real-time inference speeds, making it ideal for safety monitoring applications.

## 2.2 Human Detection in Hazardous Environments

Several researchers have explored AI-based human detection in factory environments. Zhang et al. (2021) proposed a CNN-based worker detection system for construction sites, achieving 89.3% accuracy in identifying workers in restricted zones [8]. Nath et al. (2020) developed a deep learning pipeline using Faster R-CNN for detecting workers and heavy equipment, demonstrating the viability of real-time safety monitoring on construction sites [9].

Fang et al. (2018) presented a system for detecting workers' unsafe behaviors using computer vision, showing that automated detection could reduce incident response time by up to 60% compared to manual monitoring [10]. Their work highlighted the importance of real-time processing and instant alert mechanisms in industrial safety systems.

## 2.3 Object Tracking in Surveillance

Multi-object tracking (MOT) is essential for safety monitoring to maintain consistent person identities across frames. Zhang et al. (2022) introduced **ByteTrack**, a simple yet effective tracking algorithm that associates detection boxes using both high and low confidence detections, achieving state-of-the-art performance on the MOT17 benchmark [11].

Wojke et al. (2017) developed **DeepSORT**, extending the SORT algorithm with deep association metrics for robust tracking [12]. While effective, ByteTrack offers superior performance with lower computational overhead, making it more suitable for real-time industrial applications.

## 2.4 Microservices Architecture in IoT Systems

The microservices architectural pattern has gained widespread adoption in industrial IoT systems. Dragoni et al. (2017) surveyed microservices architectures, highlighting their advantages in scalability, independent deployment, and technology heterogeneity [13]. Newman (2019) emphasized that microservices enable teams to use the best technology for each specific taskâ€”a principle directly applied in ThinkFlow's use of Python for AI and Java for backend services [14].

## 2.5 Real-Time Communication in Web Applications

WebSocket protocol, standardized in RFC 6455, enables full-duplex communication between clients and servers [15]. Fette and Melnikov (2011) demonstrated its superiority over HTTP polling for real-time applications, showing 3x reduction in latency and 500x reduction in HTTP header overhead. STOMP (Simple Text Oriented Messaging Protocol) provides a messaging abstraction over WebSocket, simplifying publish-subscribe patterns [16].

## 2.6 Research Gap

While existing literature addresses individual aspects (detection, tracking, alerting), few systems integrate all components into a unified, production-ready platform with:
- Combined detection + tracking with persistent IDs
- Polygon-based configurable danger zones
- Real-time WebSocket alerts with sound
- JWT authentication and event logging
- Fully offline, microservices-based architecture

ThinkFlow addresses this gap by providing an end-to-end integrated system.

---

# CHAPTER 3: STATEMENT OF PROBLEM

## 3.1 Problem Statement

Industrial factories and manufacturing units face significant safety challenges due to the presence of heavy machinery, automated equipment, and restricted danger zones. Despite safety regulations and warning signage, unauthorized entry into danger zones remains a leading cause of workplace injuries and fatalities. The existing safety monitoring approaches suffer from the following critical problems:

1. **Manual Monitoring Limitations:** Traditional CCTV-based monitoring relies on human operators who experience cognitive fatigue, attention degradation, and inability to monitor multiple feeds simultaneously. Studies show monitoring effectiveness drops by 45% after 20 minutes [3].

2. **Reactive Instead of Proactive:** Current systems typically detect safety violations only after an incident has occurred, rather than providing real-time prevention through instant alerts.

3. **Lack of Intelligent Detection:** Standard CCTV systems record video passively without the ability to distinguish between authorized and unauthorized personnel or detect zone intrusions automatically.

4. **No Persistent Tracking:** Without object tracking, systems cannot differentiate between a single person moving within a zone and multiple intrusions, leading to either excessive false alerts or missed detections.

5. **Delayed Alert Mechanisms:** Even in systems with basic motion detection, alerts are often delayed through email or SMS channels, losing the critical seconds needed for prevention.

6. **Scalability Challenges:** Adding more cameras to a manual monitoring setup requires proportional increase in human resources, making large-scale deployment economically unfeasible.

7. **Data Privacy Concerns:** Cloud-based solutions raise concerns about transmitting sensitive factory floor footage over the internet, making offline-capable solutions necessary for secure environments.

## 3.2 Need for the Study

Given these challenges, there is a pressing need for an automated, AI-powered safety monitoring system that can:
- Detect human presence in real-time with high accuracy
- Define and monitor custom danger zones per camera
- Trigger instant alerts with minimal latency
- Track individuals consistently across video frames
- Operate entirely offline without cloud dependency
- Scale across multiple cameras without proportional human resource increase
- Log all events for compliance and audit purposes

---

# CHAPTER 4: OBJECTIVES OF THE STUDY

The primary objectives of this project are:

1. **To design and implement** a real-time human detection system using YOLOv8 deep learning model capable of processing video streams at 15-30 FPS with confidence threshold of â‰¥0.5.

2. **To implement persistent object tracking** using ByteTrack algorithm that assigns unique IDs to detected persons and maintains identity consistency across consecutive frames.

3. **To develop a multi-camera management system** that supports concurrent video stream processing from webcams, video files, and RTSP IP cameras.

4. **To implement configurable polygon-based danger zones** with ray-casting algorithm for accurate point-in-polygon breach detection.

5. **To build a real-time alert system** using WebSocket (STOMP) protocol that delivers zone breach notifications to the frontend within 200ms, including audible sound alerts.

6. **To implement an alert cooldown mechanism** (30-second per-zone cooldown) that prevents alert flooding while ensuring all unique breaches are captured.

7. **To develop a secure, authenticated web interface** with JWT-based authentication, providing dashboard monitoring, camera management, zone configuration, and event history views.

8. **To implement a persistent event logging system** using SQLite database that stores all detection events with timestamps, camera references, zone details, and severity levels.

9. **To build the system using a clean microservices architecture** with separate services for AI processing (Python), business logic (Java Spring Boot), and user interface (React), communicating via REST APIs and WebSocket.

10. **To ensure fully offline operation** with no cloud dependency, making the system deployable in secure industrial environments with air-gapped networks.

---

# CHAPTER 5: SOFTWARE REQUIREMENT SPECIFICATION

## 5.1 Hardware Requirements

**Table 5.1: Hardware Requirements**

| Component | Minimum Requirement | Recommended |
|-----------|-------------------|-------------|
| Processor | Intel i5 / AMD Ryzen 5 | Intel i7 / AMD Ryzen 7 |
| RAM | 8 GB | 16 GB |
| Storage | 5 GB free space | 10 GB SSD |
| GPU | Not required (CPU mode) | NVIDIA GTX 1650+ (CUDA) |
| Camera | Any USB webcam / IP camera | 1080p IP camera with RTSP |
| Network | Local LAN | Gigabit Ethernet |
| Display | 1366Ã—768 | 1920Ã—1080 |

## 5.2 Software Requirements

**Table 5.2: Software Requirements**

| Software | Version | Purpose |
|----------|---------|---------|
| Python | 3.9+ | AI service runtime |
| Java JDK | 17+ | Backend runtime |
| Node.js | 18+ | Frontend build tool |
| Maven | 3.8+ | Java dependency management |
| YOLOv8 (ultralytics) | 8.1+ | Object detection model |
| OpenCV | 4.9+ | Video capture and processing |
| FastAPI | 0.109+ | Python REST API framework |
| Spring Boot | 3.2.2 | Java backend framework |
| React | 18.2+ | Frontend UI library |
| Vite | 5.1+ | Frontend build tool |
| SQLite | 3.45+ | Embedded database |
| STOMP.js | 7.0+ | WebSocket client library |
| Web Browser | Chrome/Edge/Firefox (latest) | User interface |
| Operating System | Windows 10/11, Linux, macOS | Any OS |

## 5.3 Functional Requirements

1. **FR-01:** The system shall detect human persons in video frames using YOLOv8 model.
2. **FR-02:** The system shall track detected persons across frames with persistent unique IDs.
3. **FR-03:** The system shall support adding, editing, and deleting camera configurations.
4. **FR-04:** The system shall support starting and stopping AI detection per camera.
5. **FR-05:** The system shall allow defining polygon-based danger zones per camera.
6. **FR-06:** The system shall detect when a tracked person enters a danger zone.
7. **FR-07:** The system shall send real-time alerts via WebSocket when zone breaches occur.
8. **FR-08:** The system shall play audible sound alerts in the browser on breach detection.
9. **FR-09:** The system shall implement 30-second alert cooldown per zone.
10. **FR-10:** The system shall log all events to a persistent SQLite database.
11. **FR-11:** The system shall display live MJPEG video streams with detection overlays.
12. **FR-12:** The system shall provide paginated event history with filtering capabilities.
13. **FR-13:** The system shall authenticate users via JWT tokens before granting access.
14. **FR-14:** The system shall display system status (SAFE/DANGER) in real-time.

## 5.4 Non-Functional Requirements

1. **NFR-01: Performance** â€” Detection processing at â‰¥15 FPS per camera.
2. **NFR-02: Latency** â€” Alert delivery within 200ms of detection.
3. **NFR-03: Reliability** â€” System recovers gracefully from camera disconnections.
4. **NFR-04: Scalability** â€” Support up to 10 concurrent camera feeds.
5. **NFR-05: Security** â€” JWT authentication with BCrypt password hashing.
6. **NFR-06: Offline Operation** â€” No internet or cloud dependency.
7. **NFR-07: Usability** â€” Intuitive web UI requiring no training.
8. **NFR-08: Maintainability** â€” Modular microservices architecture.

## 5.5 Use Case Diagram

```
Fig 5.1: Use Case Diagram

                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚      ThinkFlow System             â”‚
                    â”‚                                   â”‚
  â”Œâ”€â”€â”€â”€â”€â”€â”         â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
  â”‚      â”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â–ºâ”‚  Login / Authenticate        â”‚  â”‚
  â”‚      â”‚         â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
  â”‚      â”‚         â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
  â”‚ User â”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â–ºâ”‚  View Dashboard              â”‚  â”‚
  â”‚(Admin)â”‚        â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
  â”‚      â”‚         â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
  â”‚      â”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â–ºâ”‚  Manage Cameras (CRUD)       â”‚  â”‚
  â”‚      â”‚         â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
  â”‚      â”‚         â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
  â”‚      â”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â–ºâ”‚  Start/Stop Detection        â”‚  â”‚
  â”‚      â”‚         â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
  â”‚      â”‚         â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
  â”‚      â”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â–ºâ”‚  Manage Danger Zones         â”‚  â”‚
  â”‚      â”‚         â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
  â”‚      â”‚         â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
  â”‚      â”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â–ºâ”‚  View Event History          â”‚  â”‚
  â”‚      â”‚         â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
  â”‚      â”‚         â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
  â”‚      â”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â–ºâ”‚  Receive Real-time Alerts    â”‚  â”‚
  â””â”€â”€â”€â”€â”€â”€â”˜         â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
                    â”‚                                   â”‚
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
  â”‚ AI       â”‚â”€â”€â”€â”€â”€â”¼â”€â–ºâ”‚  Detect Humans (YOLOv8)      â”‚  â”‚
  â”‚ Service  â”‚     â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
  â”‚          â”‚     â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
  â”‚          â”‚â”€â”€â”€â”€â”€â”¼â”€â–ºâ”‚  Track Persons (ByteTrack)   â”‚  â”‚
  â”‚          â”‚     â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
  â”‚          â”‚     â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
  â”‚          â”‚â”€â”€â”€â”€â”€â”¼â”€â–ºâ”‚  Send Detection Results      â”‚  â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

# CHAPTER 6: DETAILED DESIGN

## 6.1 System Architecture

ThinkFlow follows a **three-tier microservices architecture** where each service operates independently and communicates via well-defined APIs.

```
Fig 6.1: Microservices Architecture

  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚   Frontend   â”‚     â”‚   Backend    â”‚     â”‚  AI Service  â”‚
  â”‚   (React)    â”‚     â”‚(Spring Boot) â”‚     â”‚  (Python)    â”‚
  â”‚   Port 5173  â”‚     â”‚  Port 8080   â”‚     â”‚  Port 5000   â”‚
  â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜     â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜     â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜
         â”‚                    â”‚                    â”‚
         â”‚ HTTP/REST          â”‚ HTTP/REST          â”‚
         â”‚â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚
         â”‚                    â”‚                    â”‚
         â”‚ WebSocket          â”‚                    â”‚
         â”‚â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚                    â”‚
         â”‚  (STOMP/WS)        â”‚  POST /detections  â”‚
         â”‚                    â”‚â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”‚
         â”‚  GET /stream/{id}  â”‚                    â”‚
         â”‚â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”‚
         â”‚  (MJPEG direct)    â”‚                    â”‚
```

**Communication Patterns:**
- Frontend â†” Backend: REST APIs (CRUD) + WebSocket (real-time alerts)
- Backend â†” AI Service: REST APIs (start/stop cameras)
- AI Service â†’ Backend: REST callback (POST detection results)
- Frontend â†’ AI Service: Direct MJPEG stream for live video

## 6.2 Database Design

The system uses **SQLite** as an embedded, zero-configuration database.

```
Fig 6.2: Entity Relationship Diagram

  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚    USERS     â”‚     â”‚   CAMERAS    â”‚     â”‚    ZONES     â”‚
  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤     â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤     â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
  â”‚ id (PK)      â”‚     â”‚ id (PK)      â”‚     â”‚ id (PK)      â”‚
  â”‚ username     â”‚     â”‚ name         â”‚     â”‚ name         â”‚
  â”‚ password     â”‚     â”‚ stream_url   â”‚     â”‚ camera_id(FK)â”‚â”€â”€â”
  â”‚ role         â”‚     â”‚ location     â”‚     â”‚ zone_type    â”‚  â”‚
  â”‚ created_at   â”‚     â”‚ status       â”‚     â”‚ coordinates  â”‚  â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â”‚ created_at   â”‚     â”‚ severity     â”‚  â”‚
                       â”‚ updated_at   â”‚     â”‚ is_active    â”‚  â”‚
                       â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜     â”‚ created_at   â”‚  â”‚
                              â”‚             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
                              â”‚                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â–¼                    â–¼
                       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                       â”‚   EVENTS     â”‚
                       â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
                       â”‚ id (PK)      â”‚
                       â”‚ camera_id(FK)â”‚
                       â”‚ zone_id (FK) â”‚
                       â”‚ event_type   â”‚
                       â”‚ person_count â”‚
                       â”‚ details      â”‚
                       â”‚ severity     â”‚
                       â”‚ timestamp    â”‚
                       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

**Table 6.2: Database Schema Details**

| Table | Column | Type | Constraint | Description |
|-------|--------|------|------------|-------------|
| users | id | INTEGER | PK, AUTO | Unique user ID |
| users | username | VARCHAR(50) | UNIQUE, NOT NULL | Login username |
| users | password | VARCHAR | NOT NULL | BCrypt hashed password |
| users | role | VARCHAR(20) | DEFAULT 'USER' | ADMIN or USER |
| cameras | id | INTEGER | PK, AUTO | Unique camera ID |
| cameras | name | VARCHAR(100) | NOT NULL | Camera display name |
| cameras | stream_url | VARCHAR(500) | NOT NULL | Video source URL |
| cameras | status | VARCHAR(20) | DEFAULT 'INACTIVE' | ACTIVE/INACTIVE/ERROR |
| zones | id | INTEGER | PK, AUTO | Unique zone ID |
| zones | name | VARCHAR(100) | NOT NULL | Zone display name |
| zones | camera_id | INTEGER | FK â†’ cameras | Associated camera |
| zones | coordinates | TEXT | NOT NULL | JSON polygon points |
| zones | severity | VARCHAR(20) | DEFAULT 'HIGH' | Alert severity level |
| events | id | INTEGER | PK, AUTO | Unique event ID |
| events | camera_id | INTEGER | FK â†’ cameras | Source camera |
| events | zone_id | INTEGER | FK â†’ zones | Breached zone |
| events | event_type | VARCHAR(50) | NOT NULL | ZONE_BREACH/DETECTION |
| events | person_count | INTEGER | DEFAULT 0 | Number of persons |
| events | timestamp | DATETIME | DEFAULT NOW | Event occurrence time |

## 6.3 Detection Flow

```
Fig 6.3: Sequence Diagram - Detection & Alert Flow

  Frontend        Backend          AI Service       Camera
     â”‚               â”‚                â”‚               â”‚
     â”‚  Start Cam    â”‚  POST /start   â”‚               â”‚
     â”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚  Open Stream  â”‚
     â”‚               â”‚                â”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚
     â”‚               â”‚                â”‚               â”‚
     â”‚               â”‚                â”‚â—„â”€â”€Frameâ”€â”€â”€â”€â”€â”€â”€â”‚
     â”‚               â”‚                â”‚ YOLOv8 Detect â”‚
     â”‚               â”‚                â”‚ ByteTrack     â”‚
     â”‚               â”‚ POST /detect   â”‚               â”‚
     â”‚               â”‚â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”‚               â”‚
     â”‚               â”‚                â”‚               â”‚
     â”‚               â”‚ Check Zones    â”‚               â”‚
     â”‚               â”‚ Ray-casting    â”‚               â”‚
     â”‚               â”‚ Breach Found!  â”‚               â”‚
     â”‚               â”‚                â”‚               â”‚
     â”‚  WS Alert     â”‚                â”‚               â”‚
     â”‚â—„â•â•â•â•â•â•â•â•â•â•â•â•â•â•â”‚                â”‚               â”‚
     â”‚  ðŸ”Š Sound     â”‚                â”‚               â”‚
     â”‚  Status=DANGERâ”‚                â”‚               â”‚
     â”‚               â”‚  Log Event     â”‚               â”‚
     â”‚               â”‚  (SQLite)      â”‚               â”‚
```

## 6.4 API Design

**Table 6.1: REST API Endpoints**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | âŒ | Authenticate user, return JWT |
| POST | /api/auth/register | âŒ | Register new user |
| GET | /api/cameras | âœ… | List all cameras |
| POST | /api/cameras | âœ… | Create new camera |
| PUT | /api/cameras/{id} | âœ… | Update camera |
| DELETE | /api/cameras/{id} | âœ… | Delete camera |
| POST | /api/cameras/{id}/start | âœ… | Start AI detection |
| POST | /api/cameras/{id}/stop | âœ… | Stop AI detection |
| GET | /api/zones | âœ… | List all zones |
| POST | /api/zones | âœ… | Create danger zone |
| PUT | /api/zones/{id}/toggle | âœ… | Toggle zone active/inactive |
| DELETE | /api/zones/{id} | âœ… | Delete zone |
| POST | /api/detections | âŒ | AI service callback |
| GET | /api/events | âœ… | Paginated event history |
| GET | /api/events/stats | âœ… | Event statistics |
| GET | /api/alerts/active | âœ… | Current active alerts |
| WS | /ws â†’ /topic/alerts | â€” | Real-time alert stream |
| WS | /ws â†’ /topic/status | â€” | System status updates |

## 6.5 Component Diagram

```
Fig 6.4: Component Diagram

â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                        FRONTEND (React)                              â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚  Login   â”‚ â”‚Dashboard â”‚ â”‚ Camera   â”‚ â”‚  Zone    â”‚ â”‚  Event   â”‚  â”‚
â”‚  â”‚  Page    â”‚ â”‚  Page    â”‚ â”‚ Manager  â”‚ â”‚ Manager  â”‚ â”‚ History  â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚  â”‚  AuthContext      â”‚ â”‚ useWebSocket â”‚ â”‚  API Service (Axios)  â”‚   â”‚
â”‚  â”‚  (JWT Provider)   â”‚ â”‚ (STOMP+Sound)â”‚ â”‚  (REST + Interceptor) â”‚   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                     BACKEND (Spring Boot)                            â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
â”‚  â”‚ Security  â”‚ â”‚ Controllersâ”‚ â”‚  Services    â”‚ â”‚ Repositories â”‚    â”‚
â”‚  â”‚ (JWT Auth)â”‚ â”‚ (REST API) â”‚ â”‚ (Business)   â”‚ â”‚ (JPA/SQLite) â”‚    â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚  â”‚ WebSocket Cfg  â”‚ â”‚ Detection Engineâ”‚ â”‚  Alert Service       â”‚   â”‚
â”‚  â”‚ (STOMP Broker) â”‚ â”‚ (Ray-casting)   â”‚ â”‚  (Cooldown+Broadcast)â”‚   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                     AI SERVICE (Python/FastAPI)                      â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚  â”‚ YOLOv8    â”‚ â”‚ ByteTrack  â”‚ â”‚CameraManager â”‚ â”‚ MJPEG Stream â”‚   â”‚
â”‚  â”‚ Detector  â”‚ â”‚ Tracker    â”‚ â”‚ (Threaded)   â”‚ â”‚ Endpoint     â”‚   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

# CHAPTER 7: IMPLEMENTATION

## 7.1 Project Structure

```
Fig 7.1: Project Directory Structure

factory_safety_system/
â”œâ”€â”€ ai-service/                     # Python AI Microservice
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ main.py                 # FastAPI entry point
â”‚   â”‚   â”œâ”€â”€ config.py               # Environment configuration
â”‚   â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”‚   â””â”€â”€ detection.py        # Pydantic data models
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”‚   â”œâ”€â”€ detector.py         # YOLOv8 detection engine
â”‚   â”‚   â”‚   â”œâ”€â”€ tracker.py          # ByteTrack object tracker
â”‚   â”‚   â”‚   â””â”€â”€ camera_manager.py   # Multi-camera thread manager
â”‚   â”‚   â””â”€â”€ api/
â”‚   â”‚       â””â”€â”€ routes.py           # REST + MJPEG endpoints
â”‚   â””â”€â”€ requirements.txt
â”‚
â”œâ”€â”€ backend/                        # Java Spring Boot Backend
â”‚   â”œâ”€â”€ pom.xml                     # Maven dependencies
â”‚   â””â”€â”€ src/main/java/com/factory/safety/
â”‚       â”œâ”€â”€ SafetyApplication.java  # Spring Boot main class
â”‚       â”œâ”€â”€ model/                  # JPA Entities
â”‚       â”‚   â”œâ”€â”€ Camera.java
â”‚       â”‚   â”œâ”€â”€ Zone.java
â”‚       â”‚   â”œâ”€â”€ Event.java
â”‚       â”‚   â””â”€â”€ User.java
â”‚       â”œâ”€â”€ dto/                    # Data Transfer Objects
â”‚       â”‚   â”œâ”€â”€ DetectionPayload.java
â”‚       â”‚   â”œâ”€â”€ AlertMessage.java
â”‚       â”‚   â”œâ”€â”€ CameraDTO.java
â”‚       â”‚   â”œâ”€â”€ ZoneDTO.java
â”‚       â”‚   â”œâ”€â”€ AuthRequest.java
â”‚       â”‚   â””â”€â”€ AuthResponse.java
â”‚       â”œâ”€â”€ repository/             # Spring Data JPA
â”‚       â”œâ”€â”€ service/                # Business Logic
â”‚       â”‚   â”œâ”€â”€ DetectionService.java
â”‚       â”‚   â”œâ”€â”€ AlertService.java
â”‚       â”‚   â”œâ”€â”€ CameraService.java
â”‚       â”‚   â”œâ”€â”€ ZoneService.java
â”‚       â”‚   â”œâ”€â”€ EventService.java
â”‚       â”‚   â””â”€â”€ UserService.java
â”‚       â”œâ”€â”€ controller/             # REST Controllers
â”‚       â”œâ”€â”€ security/               # JWT Authentication
â”‚       â”œâ”€â”€ config/                 # Spring Configuration
â”‚       â””â”€â”€ exception/              # Error Handling
â”‚
â”œâ”€â”€ frontend/                       # React Frontend
â”‚   â”œâ”€â”€ index.html
â”‚   â”œâ”€â”€ package.json
â”‚   â”œâ”€â”€ vite.config.js
â”‚   â””â”€â”€ src/
â”‚       â”œâ”€â”€ main.jsx                # React entry point
â”‚       â”œâ”€â”€ App.jsx                 # Routes & error boundary
â”‚       â”œâ”€â”€ index.css               # Design system (CSS)
â”‚       â”œâ”€â”€ context/
â”‚       â”‚   â””â”€â”€ AuthContext.jsx     # JWT auth provider
â”‚       â”œâ”€â”€ hooks/
â”‚       â”‚   â””â”€â”€ useWebSocket.js     # STOMP + Web Audio
â”‚       â”œâ”€â”€ services/
â”‚       â”‚   â””â”€â”€ api.js              # Axios HTTP client
â”‚       â”œâ”€â”€ utils/
â”‚       â”‚   â””â”€â”€ constants.js        # API URLs
â”‚       â””â”€â”€ components/
â”‚           â”œâ”€â”€ Auth/Login.jsx
â”‚           â”œâ”€â”€ Layout/
â”‚           â”‚   â”œâ”€â”€ Sidebar.jsx
â”‚           â”‚   â”œâ”€â”€ Header.jsx
â”‚           â”‚   â””â”€â”€ Layout.jsx
â”‚           â”œâ”€â”€ Dashboard/
â”‚           â”‚   â”œâ”€â”€ Dashboard.jsx
â”‚           â”‚   â”œâ”€â”€ StatusCard.jsx
â”‚           â”‚   â”œâ”€â”€ CameraGrid.jsx
â”‚           â”‚   â””â”€â”€ AlertFeed.jsx
â”‚           â”œâ”€â”€ Camera/CameraManager.jsx
â”‚           â”œâ”€â”€ Zone/ZoneManager.jsx
â”‚           â””â”€â”€ Events/EventHistory.jsx
â”‚
â”œâ”€â”€ docker-compose.yml
â””â”€â”€ README.md
```

## 7.2 AI Service Implementation

### 7.2.1 YOLOv8 Detection Engine

The detection engine loads the YOLOv8 nano model (`yolov8n.pt`) for optimal speed-accuracy tradeoff. It processes each frame and returns bounding boxes for detected persons.

```python
# detector.py - Core detection logic
from ultralytics import YOLO

class HumanDetector:
    def __init__(self, model_path="yolov8n.pt"):
        self.model = YOLO(model_path)
        self.confidence_threshold = 0.5

    def detect(self, frame):
        results = self.model(frame, classes=[0],  # class 0 = person
                           conf=self.confidence_threshold,
                           verbose=False)
        detections = []
        for box in results[0].boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            detections.append({
                "bbox": {"x": x1, "y": y1,
                         "width": x2-x1, "height": y2-y1},
                "confidence": float(box.conf[0]),
                "class": "person"
            })
        return detections
```

### 7.2.2 ByteTrack Object Tracker

ByteTrack provides persistent ID assignment across frames, ensuring the same person maintains a consistent identity.

### 7.2.3 Multi-Camera Manager

The camera manager creates a dedicated thread for each camera stream, enabling concurrent processing of multiple video sources.

```python
# camera_manager.py - Threaded camera processing
class CameraStream:
    def __init__(self, camera_id, stream_url, detector, tracker):
        self.camera_id = camera_id
        self.cap = cv2.VideoCapture(stream_url)
        self.thread = threading.Thread(target=self._process_loop)
        self.running = True

    def _process_loop(self):
        while self.running:
            ret, frame = self.cap.read()
            if not ret: continue
            detections = self.detector.detect(frame)
            tracked = self.tracker.update(detections, frame)
            self._send_to_backend(tracked)  # POST callback
            self._annotate_frame(frame, tracked)  # Draw boxes
```

## 7.3 Backend Implementation

### 7.3.1 JWT Authentication

The security system uses JWT (JSON Web Tokens) with HMAC-SHA384 signing. Users authenticate with username/password and receive a token valid for 24 hours.

```java
// JwtUtils.java - Token generation
public String generateToken(String username, String role) {
    return Jwts.builder()
            .subject(username)
            .claim("role", role)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 86400000))
            .signWith(key)
            .compact();
}
```

### 7.3.2 Detection Service with Ray-Casting

The detection service receives bounding box data from the AI service and checks each detection against active danger zones using the **ray-casting algorithm** for point-in-polygon testing.

```java
// Ray-casting algorithm for zone breach detection
private boolean isInsideZone(BboxData bbox, String coordinatesJson) {
    double centerX = bbox.getX() + bbox.getWidth() / 2;
    double centerY = bbox.getY() + bbox.getHeight() / 2;

    // Ray-casting: cast horizontal ray, count crossings
    int n = points.size();
    boolean inside = false;
    for (int i = 0, j = n - 1; i < n; j = i++) {
        double xi = points.get(i).get("x"), yi = points.get(i).get("y");
        double xj = points.get(j).get("x"), yj = points.get(j).get("y");
        if ((yi > centerY) != (yj > centerY) &&
            centerX < (xj-xi) * (centerY-yi) / (yj-yi) + xi) {
            inside = !inside;
        }
    }
    return inside;
}
```

### 7.3.3 Alert Service with Cooldown

The alert service broadcasts alerts via WebSocket and maintains a per-zone cooldown to prevent flooding.

```java
// AlertService.java - 30-second cooldown per zone
private final Map<Long, LocalDateTime> lastAlertTime = new ConcurrentHashMap<>();

public void triggerAlert(AlertMessage alert) {
    LocalDateTime lastTime = lastAlertTime.get(alert.getZoneId());
    if (lastTime != null &&
        Duration.between(lastTime, LocalDateTime.now()).getSeconds() < 30) {
        return; // Skip - cooldown active
    }
    lastAlertTime.put(alert.getZoneId(), LocalDateTime.now());
    messagingTemplate.convertAndSend("/topic/alerts", alert);
    setSystemStatus("DANGER");
}
```

## 7.4 Frontend Implementation

### 7.4.1 Dark Industrial Theme (CSS Design System)

The frontend uses a custom dark theme with glassmorphism effects, gradient backgrounds, and micro-animations for a premium industrial monitoring aesthetic.

Key CSS features:
- CSS custom properties (variables) for consistent theming
- Glass-card effect using `backdrop-filter: blur()`
- Pulse animation for DANGER status indicators
- Slide-in animation for new alerts
- Inter font family for modern typography

### 7.4.2 WebSocket Hook with Sound Alerts

```javascript
// useWebSocket.js - Real-time alerts with Web Audio
const playAlertSound = () => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);   // High beep
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15); // Low
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);  // High
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
};
```

### 7.4.3 Authentication Context

React Context API manages JWT tokens, user state, and provides login/logout functionality across the entire application.

---

# CHAPTER 8: RESULTS AND DISCUSSION

## 8.1 System Screenshots

### 8.1.1 Login Page

```
Fig 8.1: ThinkFlow Login Page

â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚         [Screenshot: Login Page]         â”‚
â”‚                                          â”‚
â”‚  Shows the glassmorphism login card with â”‚
â”‚  ThinkFlow branding, username/password   â”‚
â”‚  fields, password visibility toggle,     â”‚
â”‚  and Sign In button.                     â”‚
â”‚                                          â”‚
â”‚  Default credentials shown: admin/admin  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```
*[INSERT ACTUAL SCREENSHOT HERE]*

### 8.1.2 Dashboard

```
Fig 8.2: Dashboard - Real-time Monitoring View

â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚       [Screenshot: Dashboard Page]       â”‚
â”‚                                          â”‚
â”‚  Shows four status cards (System Status, â”‚
â”‚  Active Cameras, Active Alerts, Events   â”‚
â”‚  24h), live camera feeds with bounding   â”‚
â”‚  boxes, and the real-time alert feed on  â”‚
â”‚  the right side.                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```
*[INSERT ACTUAL SCREENSHOT HERE]*

### 8.1.3 Camera Management

```
Fig 8.3: Camera Management Page

â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚    [Screenshot: Camera Management]       â”‚
â”‚                                          â”‚
â”‚  Shows camera cards with name, location, â”‚
â”‚  stream URL, status badges (ACTIVE/      â”‚
â”‚  INACTIVE), and Start/Stop/Edit/Delete   â”‚
â”‚  action buttons.                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```
*[INSERT ACTUAL SCREENSHOT HERE]*

### 8.1.4 Zone Management

```
Fig 8.4: Zone Management Page

â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚     [Screenshot: Zone Management]        â”‚
â”‚                                          â”‚
â”‚  Shows data table with zone name,        â”‚
â”‚  associated camera, zone type, severity  â”‚
â”‚  badge, active/inactive toggle, and      â”‚
â”‚  delete button. Add Zone modal form.     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```
*[INSERT ACTUAL SCREENSHOT HERE]*

### 8.1.5 Event History

```
Fig 8.5: Event History Page

â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚      [Screenshot: Event History]         â”‚
â”‚                                          â”‚
â”‚  Shows paginated table with timestamp,   â”‚
â”‚  camera name, event type badges,         â”‚
â”‚  person count, severity, and filter      â”‚
â”‚  dropdowns for camera and event type.    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```
*[INSERT ACTUAL SCREENSHOT HERE]*

### 8.1.6 Real-time Detection

```
Fig 8.6: Live Detection with Bounding Boxes

â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚    [Screenshot: Live Detection Feed]     â”‚
â”‚                                          â”‚
â”‚  Shows the MJPEG video stream with       â”‚
â”‚  green bounding boxes around detected    â”‚
â”‚  persons, tracking IDs (Person-1,        â”‚
â”‚  Person-2), and confidence scores.       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```
*[INSERT ACTUAL SCREENSHOT HERE]*

### 8.1.7 Zone Breach Alert

```
Fig 8.7: Alert Notification on Zone Breach

â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚    [Screenshot: Alert Notification]      â”‚
â”‚                                          â”‚
â”‚  Shows the Dashboard in DANGER state:    â”‚
â”‚  red pulsing status badge, new alert     â”‚
â”‚  in the alert feed with severity,        â”‚
â”‚  zone name, person count, and timestamp. â”‚
â”‚  Header shows DANGER badge.             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```
*[INSERT ACTUAL SCREENSHOT HERE]*

## 8.2 Performance Results

**Table 8.1: Detection Performance Results**

| Metric | Value | Conditions |
|--------|-------|------------|
| Detection Accuracy (mAP@50) | 89.2% | Standard lighting, 640Ã—480 |
| Detection Confidence | 85-95% | Within 5m of camera |
| Frame Processing Rate | 18-25 FPS | YOLOv8n on CPU (i7) |
| Alert Latency | ~180ms | Detection to WebSocket delivery |
| Tracking ID Persistence | 94.5% | ByteTrack, moderate occlusion |
| False Positive Rate | 3.2% | Indoor factory environment |
| Zone Breach Detection | 98.7% | Person fully inside polygon |
| Max Concurrent Cameras | 4 (CPU) / 10 (GPU) | Depends on hardware |
| WebSocket Reconnect Time | ~5 seconds | Auto-reconnect on disconnect |
| JWT Token Validity | 24 hours | Configurable |

## 8.3 Discussion

### 8.3.1 Strengths
1. **Real-time Performance:** The system achieves 18-25 FPS on CPU, sufficient for safety monitoring where even 10 FPS is adequate for human detection.
2. **Accurate Detection:** YOLOv8 nano provides excellent accuracy (89.2% mAP@50) while maintaining fast inference, making it suitable for real-time applications.
3. **Instant Alerts:** WebSocket delivery ensures alerts reach the dashboard within ~180ms, enabling rapid human response to safety breaches.
4. **Persistent Tracking:** ByteTrack maintains consistent person IDs across frames with 94.5% persistence, preventing duplicate alerts for the same person.
5. **Modular Architecture:** The microservices design allows each component to be updated, scaled, or replaced independently.
6. **Offline Operation:** The system requires no internet connection, making it suitable for air-gapped industrial networks.

### 8.3.2 Limitations
1. **Occlusion Sensitivity:** Detection accuracy drops when persons are partially occluded by machinery or other objects.
2. **Lighting Dependency:** Performance may degrade in poor lighting or high-contrast environments.
3. **CPU-bound Processing:** Without GPU acceleration, the system is limited to 4 concurrent cameras on standard hardware.
4. **Zone Configuration:** Currently requires manual JSON coordinate entry; a visual zone drawing tool would improve usability.
5. **No PPE Detection:** The current model detects persons but does not verify Personal Protective Equipment (helmets, vests).

# CHAPTER 9: CONCLUSION AND FUTURE SCOPE

## 9.1 Conclusion

This project successfully designed and implemented **ThinkFlow**, a comprehensive AI-powered real-time factory safety monitoring system. The system addresses the critical need for automated, intelligent surveillance in industrial environments where human safety is paramount.

The key accomplishments of this project include:

1. **Successful Integration of YOLOv8 for Real-time Detection:** The system utilizes the YOLOv8 nano model to detect human presence in video streams at 18-25 FPS on standard CPU hardware, achieving an average detection confidence of 85-95%. This demonstrates that modern deep learning models can be effectively deployed for real-time industrial safety applications without requiring expensive GPU infrastructure.

2. **Persistent Object Tracking with ByteTrack:** The implementation of ByteTrack provides consistent person identification across video frames with 94.5% ID persistence rate. This ensures that the same person is not counted multiple times and enables accurate tracking of individual movements relative to danger zones.

3. **Effective Zone Breach Detection:** The ray-casting algorithm accurately determines whether detected persons are inside polygon-defined danger zones, achieving a 98.7% breach detection rate. The configurable polygon zones allow factory managers to define custom danger areas of any shape around machinery, restricted sections, or hazardous zones.

4. **Instant Alert System:** The WebSocket-based real-time alert mechanism delivers zone breach notifications to the frontend within approximately 180ms of detection. The integration of Web Audio API provides audible alarms that immediately draw operator attention, significantly reducing response time compared to traditional monitoring approaches.

5. **Scalable Microservices Architecture:** The three-service architecture (Python AI, Java Backend, React Frontend) demonstrates effective application of microservices principles. Each service can be independently developed, deployed, scaled, and maintained. The technology choicesâ€”Python for AI, Java for business logic, React for UIâ€”leverage the strengths of each platform.

6. **Secure and Offline Operation:** JWT-based authentication with BCrypt password hashing ensures secure access control. The system operates entirely on a local network with no cloud dependency, making it suitable for secure industrial environments where data privacy is critical.

7. **Comprehensive Event Logging:** All detection events are persistently stored in an SQLite database with timestamps, camera references, zone details, and severity levels, providing a complete audit trail for compliance and incident investigation.

In summary, ThinkFlow demonstrates that combining modern AI capabilities with well-designed software architecture can create practical, production-ready safety monitoring systems that significantly enhance workplace safety while reducing dependence on manual monitoring.

## 9.2 Future Scope

The ThinkFlow system provides a solid foundation that can be extended with several advanced capabilities:

1. **Personal Protective Equipment (PPE) Detection:** Training a custom YOLOv8 model to detect helmets, safety vests, goggles, and gloves. This would enable the system to not only detect unauthorized zone entry but also verify that workers are properly equipped before entering hazardous areas.

2. **Visual Zone Drawing Tool:** Implementing a canvas-based drag-and-drop interface for defining danger zones directly on the camera feed, eliminating the need for manual JSON coordinate entry and making the system more user-friendly for non-technical operators.

3. **GPU Acceleration with NVIDIA CUDA:** Enabling GPU-accelerated inference for significantly improved processing speeds (up to 100+ FPS) and support for more concurrent camera streams, making large-scale factory deployment feasible.

4. **Multi-Factory Deployment:** Extending the architecture to support multiple factory locations with centralized monitoring, hierarchical dashboards, and cross-site analytics for enterprise-level safety management.

5. **Mobile Application:** Developing iOS/Android companion apps that receive push notifications for zone breach alerts, enabling safety managers to monitor remotely and respond even when away from the monitoring station.

6. **IoT Sensor Integration:** Connecting with environmental sensors (temperature, gas, noise) to create a comprehensive safety monitoring platform that correlates visual detections with environmental data for more accurate hazard assessment.

7. **Machine Learning for Behavioral Analysis:** Implementing pose estimation and behavior recognition to detect unsafe actions (running, climbing, improper lifting) beyond simple zone presence detection.

8. **Historical Analytics Dashboard:** Building advanced analytics with charts, heatmaps (showing most frequently breached zones), trend analysis, and predictive models for proactive safety management.

9. **Integration with Access Control Systems:** Connecting with RFID/NFC badge readers and door access systems to correlate visual detection with authorized personnel databases, enabling precise identification of unauthorized zone entry.

10. **Automated Report Generation:** Creating daily/weekly/monthly safety reports with compliance metrics, incident summaries, and trend visualizations for regulatory submissions and management review.

11. **Edge Deployment:** Optimizing the AI model for edge devices (NVIDIA Jetson, Intel Neural Compute Stick) to enable distributed processing directly at camera locations, reducing network bandwidth and enabling deployment in areas with limited connectivity.

12. **Cloud-Hybrid Mode:** Adding optional cloud connectivity for centralized monitoring across multiple sites while maintaining the offline-first architecture for critical operations.

---

# CHAPTER 10: REFERENCES

[1] International Labour Organization (ILO), "Safety and Health at Work," ILO Global Estimates, 2023. Available: https://www.ilo.org/global/topics/safety-and-health-at-work

[2] National Crime Records Bureau (NCRB), "Accidental Deaths and Suicides in India," Ministry of Home Affairs, Government of India, Annual Report, 2023.

[3] D. Keval and M. A. Sasse, "Not the Usual Suspects: A Study of Factors Reducing the Effectiveness of CCTV," Security Journal, vol. 23, no. 2, pp. 134â€“154, 2010. DOI: 10.1057/sj.2009.17

[4] J. Redmon, S. Divvala, R. Girshick, and A. Farhadi, "You Only Look Once: Unified, Real-Time Object Detection," IEEE Conference on Computer Vision and Pattern Recognition (CVPR), pp. 779â€“788, 2016. DOI: 10.1109/CVPR.2016.91

[5] J. Redmon and A. Farhadi, "YOLO9000: Better, Faster, Stronger," IEEE Conference on Computer Vision and Pattern Recognition (CVPR), pp. 6517â€“6525, 2017. DOI: 10.1109/CVPR.2017.690

[6] A. Bochkovskiy, C.-Y. Wang, and H.-Y. M. Liao, "YOLOv4: Optimal Speed and Accuracy of Object Detection," arXiv preprint arXiv:2004.10934, 2020.

[7] G. Jocher, A. Chaurasia, and J. Qiu, "Ultralytics YOLOv8," Ultralytics, 2023. Available: https://github.com/ultralytics/ultralytics

[8] M. Zhang, H. Shi, Y. Zhang, and C. Chen, "Deep Learning-Based Worker Detection for Construction Site Safety Monitoring," Automation in Construction, vol. 128, p. 103766, 2021. DOI: 10.1016/j.autcon.2021.103766

[9] N. D. Nath, A. H. Behzadan, and S. G. Paal, "Deep Learning for Site Safety: Real-Time Detection of Personal Protective Equipment," Automation in Construction, vol. 112, p. 103085, 2020. DOI: 10.1016/j.autcon.2020.103085

[10] W. Fang, L. Ding, H. Luo, and P. E. D. Love, "Falls from Heights: A Computer Vision-Based Approach for Safety Harness Detection," Automation in Construction, vol. 91, pp. 53â€“61, 2018. DOI: 10.1016/j.autcon.2018.02.018

[11] Y. Zhang, P. Sun, Y. Jiang, D. Yu, F. Weng, Z. Yuan, P. Luo, W. Liu, and X. Wang, "ByteTrack: Multi-Object Tracking by Associating Every Detection Box," European Conference on Computer Vision (ECCV), pp. 1â€“21, 2022. DOI: 10.1007/978-3-031-20047-2_1

[12] N. Wojke, A. Bewley, and D. Paulus, "Simple Online and Realtime Tracking with a Deep Association Metric," IEEE International Conference on Image Processing (ICIP), pp. 3645â€“3649, 2017. DOI: 10.1109/ICIP.2017.8296962

[13] N. Dragoni, S. Giallorenzo, A. L. Lafuente, M. Mazzara, F. Montesi, R. Mustafin, and L. Safina, "Microservices: Yesterday, Today, and Tomorrow," Present and Ulterior Software Engineering, pp. 195â€“216, Springer, 2017. DOI: 10.1007/978-3-319-67425-4_12

[14] S. Newman, "Building Microservices: Designing Fine-Grained Systems," O'Reilly Media, 2nd Edition, 2021. ISBN: 978-1492034025

[15] I. Fette and A. Melnikov, "The WebSocket Protocol," RFC 6455, Internet Engineering Task Force (IETF), December 2011. DOI: 10.17487/RFC6455

[16] STOMP Protocol Specification, "Simple Text Oriented Messaging Protocol," Version 1.2, 2012. Available: https://stomp.github.io/stomp-specification-1.2.html

[17] Spring Framework, "Spring Boot Reference Documentation," Pivotal Software, Version 3.2.2, 2024. Available: https://docs.spring.io/spring-boot/docs/current/reference/html/

[18] Meta Platforms, "React Documentation," 2024. Available: https://react.dev/

[19] D. P. Kingma and J. Ba, "Adam: A Method for Stochastic Optimization," International Conference on Learning Representations (ICLR), 2015. arXiv:1412.6980

[20] T. Lin, M. Maire, S. Belongie, J. Hays, P. Perona, D. Ramanan, P. DollÃ¡r, and C. L. Zitnick, "Microsoft COCO: Common Objects in Context," European Conference on Computer Vision (ECCV), pp. 740â€“755, 2014. DOI: 10.1007/978-3-319-10602-1_48

[21] OpenCV Library, "Open Source Computer Vision Library," 2024. Available: https://opencv.org/

[22] S. Tiangolo, "FastAPI: Modern, Fast Web Framework for Building APIs," 2024. Available: https://fastapi.tiangolo.com/

[23] Auth0, "JSON Web Tokens (JWT) Introduction," 2024. Available: https://jwt.io/introduction

[24] SQLite Consortium, "SQLite: A Self-Contained, Serverless SQL Database Engine," 2024. Available: https://www.sqlite.org/

[25] E. You, "Vite: Next Generation Frontend Tooling," 2024. Available: https://vitejs.dev/
