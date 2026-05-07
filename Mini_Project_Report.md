# Kolhapur Institute of Technology's College of Engineering (Empowered Autonomous), Kolhapur

---

## **"ThinkFlow: AI-Powered Real-Time Factory Safety Monitoring System"**

Submitted in partial fulfillment of the requirements of the degree of

### Mini Project-IV — UCBIL0671

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

1. **Python AI Service** — Performs real-time human detection using YOLOv8 and object tracking using ByteTrack
2. **Java Spring Boot Backend** — Manages cameras, zones, events, authentication, and alert broadcasting
3. **React Frontend** — Provides a modern, real-time dashboard for monitoring and management

The system operates entirely offline on a local network, requiring no cloud connectivity, making it suitable for secure industrial environments where data privacy is paramount.

## 1.3 Motivation

The motivation behind this project stems from several critical observations:

- **Human Limitation in Monitoring:** Factory supervisors cannot watch multiple camera feeds simultaneously for extended periods without fatigue-induced lapses [3].
- **Delayed Response Times:** Traditional systems often detect safety breaches only after incidents occur, rather than preventing them in real-time.
- **Scalability Issues:** Manual monitoring does not scale — adding more cameras requires proportionally more human operators.
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

┌────────────────────┐         ┌──────────────────────┐         ┌─────────────────┐
│   React Frontend   │◄──WS──►│   Spring Boot API    │◄──REST─►│  Python AI Svc  │
│    (port 5173)     │  REST   │    (port 8080)       │         │   (port 5000)   │
│                    │         │                      │         │                 │
│ • Login Page       │         │ • JWT Auth           │         │ • YOLOv8 Model  │
│ • Dashboard        │         │ • Camera CRUD        │         │ • ByteTrack     │
│ • Camera Mgmt      │         │ • Zone CRUD          │         │ • Multi-Camera  │
│ • Zone Mgmt        │         │ • Detection Engine   │         │ • MJPEG Stream  │
│ • Event History    │         │ • Alert + Cooldown   │         │                 │
│ • WebSocket Client │         │ • WebSocket Server   │         │                 │
│ • Sound Alerts     │         │ • SQLite Database    │         │                 │
└────────────────────┘         └──────────────────────┘         └─────────────────┘
```

---

# CHAPTER 2: LITERATURE REVIEW

## 2.1 Object Detection in Industrial Safety

Object detection has evolved significantly over the past decade, transitioning from traditional handcrafted feature-based methods to deep learning approaches. Redmon et al. (2016) introduced YOLO (You Only Look Once), a unified architecture that frames object detection as a single regression problem, enabling real-time processing at 45 FPS [5]. Subsequent versions—YOLOv2, YOLOv3, YOLOv4—progressively improved accuracy and speed, with Bochkovskiy et al. (2020) demonstrating YOLOv4's effectiveness in industrial applications [6].

Jocher et al. (2023) released **YOLOv8** through Ultralytics, introducing architectural improvements including a C2f module for better feature extraction, anchor-free detection heads, and improved training pipelines [7]. YOLOv8 achieves state-of-the-art performance on the COCO dataset with 53.9% mAP@50-95 in its largest variant while maintaining real-time inference speeds, making it ideal for safety monitoring applications.

## 2.2 Human Detection in Hazardous Environments

Several researchers have explored AI-based human detection in factory environments. Zhang et al. (2021) proposed a CNN-based worker detection system for construction sites, achieving 89.3% accuracy in identifying workers in restricted zones [8]. Nath et al. (2020) developed a deep learning pipeline using Faster R-CNN for detecting workers and heavy equipment, demonstrating the viability of real-time safety monitoring on construction sites [9].

Fang et al. (2018) presented a system for detecting workers' unsafe behaviors using computer vision, showing that automated detection could reduce incident response time by up to 60% compared to manual monitoring [10]. Their work highlighted the importance of real-time processing and instant alert mechanisms in industrial safety systems.

## 2.3 Object Tracking in Surveillance

Multi-object tracking (MOT) is essential for safety monitoring to maintain consistent person identities across frames. Zhang et al. (2022) introduced **ByteTrack**, a simple yet effective tracking algorithm that associates detection boxes using both high and low confidence detections, achieving state-of-the-art performance on the MOT17 benchmark [11].

Wojke et al. (2017) developed **DeepSORT**, extending the SORT algorithm with deep association metrics for robust tracking [12]. While effective, ByteTrack offers superior performance with lower computational overhead, making it more suitable for real-time industrial applications.

## 2.4 Microservices Architecture in IoT Systems

The microservices architectural pattern has gained widespread adoption in industrial IoT systems. Dragoni et al. (2017) surveyed microservices architectures, highlighting their advantages in scalability, independent deployment, and technology heterogeneity [13]. Newman (2019) emphasized that microservices enable teams to use the best technology for each specific task—a principle directly applied in ThinkFlow's use of Python for AI and Java for backend services [14].

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

1. **To design and implement** a real-time human detection system using YOLOv8 deep learning model capable of processing video streams at 15-30 FPS with confidence threshold of ≥0.5.

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
| Display | 1366×768 | 1920×1080 |

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

1. **NFR-01: Performance** — Detection processing at ≥15 FPS per camera.
2. **NFR-02: Latency** — Alert delivery within 200ms of detection.
3. **NFR-03: Reliability** — System recovers gracefully from camera disconnections.
4. **NFR-04: Scalability** — Support up to 10 concurrent camera feeds.
5. **NFR-05: Security** — JWT authentication with BCrypt password hashing.
6. **NFR-06: Offline Operation** — No internet or cloud dependency.
7. **NFR-07: Usability** — Intuitive web UI requiring no training.
8. **NFR-08: Maintainability** — Modular microservices architecture.

## 5.5 Use Case Diagram

```
Fig 5.1: Use Case Diagram

                    ┌──────────────────────────────────┐
                    │      ThinkFlow System             │
                    │                                   │
  ┌──────┐         │  ┌─────────────────────────────┐  │
  │      │─────────┼─►│  Login / Authenticate        │  │
  │      │         │  └─────────────────────────────┘  │
  │      │         │  ┌─────────────────────────────┐  │
  │ User │─────────┼─►│  View Dashboard              │  │
  │(Admin)│        │  └─────────────────────────────┘  │
  │      │         │  ┌─────────────────────────────┐  │
  │      │─────────┼─►│  Manage Cameras (CRUD)       │  │
  │      │         │  └─────────────────────────────┘  │
  │      │         │  ┌─────────────────────────────┐  │
  │      │─────────┼─►│  Start/Stop Detection        │  │
  │      │         │  └─────────────────────────────┘  │
  │      │         │  ┌─────────────────────────────┐  │
  │      │─────────┼─►│  Manage Danger Zones         │  │
  │      │         │  └─────────────────────────────┘  │
  │      │         │  ┌─────────────────────────────┐  │
  │      │─────────┼─►│  View Event History          │  │
  │      │         │  └─────────────────────────────┘  │
  │      │         │  ┌─────────────────────────────┐  │
  │      │─────────┼─►│  Receive Real-time Alerts    │  │
  └──────┘         │  └─────────────────────────────┘  │
                    │                                   │
  ┌──────────┐     │  ┌─────────────────────────────┐  │
  │ AI       │─────┼─►│  Detect Humans (YOLOv8)      │  │
  │ Service  │     │  └─────────────────────────────┘  │
  │          │     │  ┌─────────────────────────────┐  │
  │          │─────┼─►│  Track Persons (ByteTrack)   │  │
  │          │     │  └─────────────────────────────┘  │
  │          │     │  ┌─────────────────────────────┐  │
  │          │─────┼─►│  Send Detection Results      │  │
  └──────────┘     │  └─────────────────────────────┘  │
                    └──────────────────────────────────┘
```
